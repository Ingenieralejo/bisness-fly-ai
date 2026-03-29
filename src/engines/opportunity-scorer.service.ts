import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Opportunity Scoring Algorithm
 * 
 * Composite score = weighted sum of 5 factors:
 *   demandSignal     (0.30) — trend momentum, search volume proxy
 *   marginPotential  (0.25) — estimated profit margin
 *   competitionGap   (0.20) — inverse of competition density
 *   entrySpeed       (0.15) — how fast we can start monetizing
 *   scalability      (0.10) — growth ceiling
 * 
 * Final = rawScore * confidenceMultiplier
 */

interface ScoringInput {
  demandSignal: number;      // 0-100
  marginPotential: number;   // 0-100
  competitionGap: number;    // 0-100 (higher = less competition)
  entrySpeed: number;        // 0-100 (higher = faster entry)
  scalability: number;       // 0-100
  confidence: number;        // 0.0-1.0
}

export interface ScoredOpportunity {
  id: string;
  title: string;
  niche: string;
  score: number;
  breakdown: {
    demandSignal: number;
    marginPotential: number;
    competitionGap: number;
    entrySpeed: number;
    scalability: number;
    confidence: number;
  };
  recommendation: string;
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
}

const WEIGHTS = {
  demandSignal: 0.30,
  marginPotential: 0.25,
  competitionGap: 0.20,
  entrySpeed: 0.15,
  scalability: 0.10,
} as const;

@Injectable()
export class OpportunityScorerService {
  private readonly logger = new Logger(OpportunityScorerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Calculate composite opportunity score */
  calculateScore(input: ScoringInput): number {
    const rawScore =
      input.demandSignal * WEIGHTS.demandSignal +
      input.marginPotential * WEIGHTS.marginPotential +
      input.competitionGap * WEIGHTS.competitionGap +
      input.entrySpeed * WEIGHTS.entrySpeed +
      input.scalability * WEIGHTS.scalability;

    return Math.round(rawScore * input.confidence * 100) / 100;
  }

  /** Determine tier based on score */
  getTier(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
    if (score >= 80) return 'S';
    if (score >= 65) return 'A';
    if (score >= 50) return 'B';
    if (score >= 35) return 'C';
    return 'D';
  }

  /** Generate recommendation based on score and factors */
  generateRecommendation(input: ScoringInput, score: number): string {
    const tier = this.getTier(score);

    if (tier === 'S') {
      return '🔥 EXECUTE IMMEDIATELY — High demand, low competition, fast entry. Deploy all available resources.';
    }
    if (tier === 'A') {
      return '⚡ STRONG OPPORTUNITY — Validate with a small test campaign before full commitment.';
    }
    if (tier === 'B') {
      return '📊 WORTH EXPLORING — Good potential but needs validation. Run a 48h pilot.';
    }
    if (tier === 'C') {
      if (input.marginPotential > 70) {
        return '💰 HIGH MARGIN BUT RISKY — The margins are attractive but other factors are weak. Proceed with caution.';
      }
      return '⚠️ MARGINAL — Only pursue if no better opportunities exist.';
    }
    return '❌ SKIP — ROI too low. Focus resources elsewhere.';
  }

  /** Map competition level string to numeric value */
  private competitionToScore(level: string): number {
    const map: Record<string, number> = {
      'LOW': 90,
      'MEDIUM': 55,
      'HIGH': 25,
      'SATURATED': 5,
    };
    return map[level] ?? 50;
  }

  /** Map entry barrier string to numeric value */
  private barrierToEntrySpeed(barrier: string): number {
    const map: Record<string, number> = {
      'LOW': 90,
      'MEDIUM': 55,
      'HIGH': 20,
    };
    return map[barrier] ?? 50;
  }

  /** Map trend direction to scalability estimate */
  private trendToScalability(trend: string): number {
    const map: Record<string, number> = {
      'RISING': 85,
      'STABLE': 50,
      'DECLINING': 15,
    };
    return map[trend] ?? 50;
  }

  /** Score all detected/validated opportunities in the database */
  async scoreAllOpportunities(): Promise<ScoredOpportunity[]> {
    this.logger.log('🧮 Scoring all market opportunities...');

    const opportunities = await this.prisma.marketOpportunity.findMany({
      where: { status: { in: ['DETECTED', 'VALIDATED'] } },
    });

    const scored: ScoredOpportunity[] = [];

    for (const opp of opportunities) {
      const input: ScoringInput = {
        demandSignal: opp.demandScore,
        marginPotential: opp.marginEstimate ? Math.min(opp.marginEstimate, 100) : 40,
        competitionGap: this.competitionToScore(opp.competitionLevel ?? 'MEDIUM'),
        entrySpeed: this.barrierToEntrySpeed(opp.entryBarrier ?? 'MEDIUM'),
        scalability: this.trendToScalability(opp.trendDirection ?? 'STABLE'),
        confidence: opp.confidence,
      };

      const score = this.calculateScore(input);
      const tier = this.getTier(score);
      const recommendation = this.generateRecommendation(input, score);

      // Persist score back to the opportunity
      await this.prisma.marketOpportunity.update({
        where: { id: opp.id },
        data: {
          demandScore: score,
          metadata: JSON.stringify({
            ...JSON.parse(opp.metadata || '{}'),
            lastScoredAt: new Date().toISOString(),
            scoringBreakdown: input,
            tier,
          }),
        },
      });

      scored.push({
        id: opp.id,
        title: opp.title,
        niche: opp.niche ?? 'General',
        score,
        breakdown: input,
        recommendation,
        tier,
      });
    }

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    this.logger.log(`✅ Scored ${scored.length} opportunities. Top: ${scored[0]?.title || 'none'} (${scored[0]?.score || 0})`);
    return scored;
  }
}
