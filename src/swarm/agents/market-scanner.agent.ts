import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

/**
 * AGENT: MARKET SCANNER
 * Scans global markets for emerging opportunities using public data APIs.
 * Feeds the Opportunity Scorer with raw demand signals.
 */
@Injectable()
export class MarketScannerAgent {
  private readonly logger = new Logger(MarketScannerAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Execute a market scan for a given region
   * Probes DuckDuckGo + public APIs for niche demand signals
   */
  async executeScan(region: string = 'GLOBAL'): Promise<void> {
    this.logger.log(`🌐 MARKET SCANNER: Initiating scan for region: ${region}...`);

    const niches = [
      'AI automation for law firms',
      'dental clinic chatbot',
      'SaaS lead generation',
      'WhatsApp business automation',
      'ecommerce AI customer service',
      'AI accounting Colombia',
    ];

    for (const niche of niches) {
      try {
        const response = await axios.get(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(niche)}&format=json&no_redirect=1`,
          { timeout: 5000 },
        ).catch(() => null);

        let demandScore = 30; // baseline
        if (response?.data?.Abstract) demandScore += 25;
        if (response?.data?.RelatedTopics?.length > 3) demandScore += 20;

        // Only persist if we detect meaningful demand
        if (demandScore >= 40) {
          const existing = await this.prisma.marketOpportunity.findFirst({
            where: { title: { contains: niche.slice(0, 20) } },
          });

          if (!existing) {
            await this.prisma.marketOpportunity.create({
              data: {
                title: niche,
                status: 'DETECTED',
                demandScore,
                confidence: demandScore / 100,
                sector: this.inferSector(niche),
                niche,
                trendDirection: demandScore >= 60 ? 'RISING' : 'STABLE',
                entryBarrier: 'MEDIUM',
                competitionLevel: 'MEDIUM',
                metadata: JSON.stringify({ region, scannedAt: new Date().toISOString() }),
              },
            });
            this.logger.log(`📡 Opportunity detected: "${niche}" [Score: ${demandScore}]`);
          }
        }

        // Rate limit: 500ms between probes
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Unknown scan error';
        this.logger.warn(`⚠️ Scan failed for "${niche}": ${errMsg}`);
      }
    }

    this.logger.log(`✅ MARKET SCANNER: Scan complete for ${region}.`);
  }

  private inferSector(niche: string): string {
    const lower = niche.toLowerCase();
    if (lower.includes('law') || lower.includes('legal')) return 'Legal';
    if (lower.includes('dental') || lower.includes('clinic')) return 'Healthcare';
    if (lower.includes('saas')) return 'Technology';
    if (lower.includes('ecommerce') || lower.includes('shopify')) return 'E-Commerce';
    if (lower.includes('accounting') || lower.includes('finance')) return 'Finance';
    return 'General';
  }
}
