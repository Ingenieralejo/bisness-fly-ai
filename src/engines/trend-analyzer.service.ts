import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

interface TrendData {
  keyword: string;
  region: string;
  interest: number;        // 0-100 relative interest
  trend: 'RISING' | 'STABLE' | 'DECLINING';
  relatedQueries: string[];
}

@Injectable()
export class TrendAnalyzerService {
  private readonly logger = new Logger(TrendAnalyzerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Scan Google Trends via the unofficial SerpAPI-style proxy
   * Falls back to DuckDuckGo trending topics if primary fails
   */
  async analyzeTrend(keyword: string, region: string = 'CO'): Promise<TrendData> {
    this.logger.log(`📊 Analyzing trend: "${keyword}" in ${region}...`);

    try {
      // Attempt Google Trends via public suggestions API
      const suggestUrl = `https://trends.google.com/trends/api/autocomplete/${encodeURIComponent(keyword)}?hl=es&tz=-300&geo=${region}`;
      const response = await axios.get(suggestUrl, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
      }).catch(() => null);

      let interest = 0;
      const relatedQueries: string[] = [];

      if (response?.data) {
        // Google Trends returns JSONP-style data prefixed with ")]}'\n"
        const cleanData = typeof response.data === 'string'
          ? response.data.replace(/^\)\]\}'\n/, '')
          : response.data;

        try {
          const parsed = typeof cleanData === 'string' ? JSON.parse(cleanData) : cleanData;
          if (parsed?.default?.topics) {
            interest = parsed.default.topics.length * 15; // Rough heuristic
            relatedQueries.push(
              ...parsed.default.topics
                .slice(0, 5)
                .map((t: { title: string }) => t.title)
            );
          }
        } catch {
          this.logger.debug('Trends parse failed, using fallback scoring');
        }
      }

      // Fallback: use DuckDuckGo instant answers for demand signal
      if (interest === 0) {
        interest = await this.estimateInterestFromDDG(keyword);
      }

      const trend: 'RISING' | 'STABLE' | 'DECLINING' =
        interest >= 60 ? 'RISING' : interest >= 30 ? 'STABLE' : 'DECLINING';

      const result: TrendData = {
        keyword,
        region,
        interest: Math.min(interest, 100),
        trend,
        relatedQueries,
      };

      // Store as market signal
      await this.prisma.marketSignal.create({
        data: {
          type: 'TREND',
          source: 'google_trends',
          strength: interest / 100,
          keyword,
          region,
          signalStrength: interest,
          rawData: JSON.stringify(result),
          interpretation: `"${keyword}" shows ${trend.toLowerCase()} demand in ${region} with ${interest}/100 interest.`,
          actionable: interest >= 50,
        },
      });

      return result;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`⚠️ Trend analysis failed for "${keyword}": ${errMsg}`);
      return {
        keyword,
        region,
        interest: 0,
        trend: 'STABLE',
        relatedQueries: [],
      };
    }
  }

  /** Estimate demand using DuckDuckGo instant answer API */
  private async estimateInterestFromDDG(keyword: string): Promise<number> {
    try {
      const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(keyword)}&format=json&no_redirect=1`, {
        timeout: 5000,
      });

      const data = response.data;
      let score = 0;

      // Presence of abstract = known topic = at least moderate demand
      if (data?.Abstract) score += 30;
      if (data?.RelatedTopics?.length > 0) score += data.RelatedTopics.length * 5;
      if (data?.Results?.length > 0) score += 20;

      return Math.min(score, 100);
    } catch {
      return 25; // Baseline default
    }
  }

  /** Batch analyze multiple keywords */
  async batchAnalyze(keywords: string[], region: string = 'CO'): Promise<TrendData[]> {
    const results: TrendData[] = [];

    for (const keyword of keywords) {
      const result = await this.analyzeTrend(keyword, region);
      results.push(result);
      // Rate limit: 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results.sort((a, b) => b.interest - a.interest);
  }

  /** Get stored signals */
  async getRecentSignals(limit: number = 20) {
    return this.prisma.marketSignal.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Get actionable signals only */
  async getActionableSignals() {
    return this.prisma.marketSignal.findMany({
      where: { actionable: true, actedOn: false },
      orderBy: { signalStrength: 'desc' },
    });
  }
}
