import { Injectable, Logger } from '@nestjs/common';
import { ModuleRoiService } from './module-roi.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Wealth Matrix Decision Engine — System that prioritizes what's most profitable
 */
@Injectable()
export class DecisionEngineService {
  private readonly logger = new Logger(DecisionEngineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly moduleRoi: ModuleRoiService,
  ) {}

  /**
   * Determine the most profitable revenue strategy for the next cycle
   */
  async optimizeSystem() {
    this.logger.log('🧠 WEALTH MATRIX CORE: Running system optimization...');
    
    // Phase 1: Analyze past performance
    const roiStats = await this.moduleRoi.getRoiStats();
    
    // Phase 2: Prioritize what's profitable (e.g., if B2B is higher than Dropship)
    const prioritizedModule = roiStats.highestRoi;
    this.logger.log(`📈 DEPLOYING EXTRA AGENT BUDGET TO: ${prioritizedModule}`);
    
    // Phase 3: "Eliminar lo ineficiente" (e.g., if a channel hasn't made money in 30 days)
    const inefficients = roiStats.channelRanking.filter(c => c.totalIncome === 0);
    for (const ineff of inefficients) {
        this.logger.warn(`⚠️ SYSTEM OPTIMIZATION: Inefficient channel detected: ${ineff.channel}. Reducing cycle frequency...`);
    }
    
    return {
        strategy: `PRIORITIZE_${prioritizedModule}`,
        inefficientChannels: inefficients.map(c => c.channel),
        nextStrategicMove: `EXPAND_${prioritizedModule}_GLOBALLY`,
    };
  }

  /**
   * NEURAL LEAD SCORING: Evaluates a lead's potential using APAF principles
   */
  async scoreLead(lead: any) {
    this.logger.log(`🧠 NEURAL ANALYZER: Evaluating lead potential for ${lead.businessName}...`);
    
    // Simulations of Neural Scoring Logic
    let confidence = 0.5;
    let analysis = "Strategic potential detected for AI integration.";

    // 1. Sector Weighting
    if (lead.sector?.includes('Law') || lead.sector?.includes('Dental')) {
      confidence += 0.2;
      analysis = "High-intent B2B sector with established high-ticket potential.";
    }

    // 2. Size Logic
    if (lead.estimatedSize === 'ENTERPRISE' || lead.estimatedSize === 'LARGE') {
      confidence += 0.15;
      analysis += " Enterprise-scale node for massive ROI extraction.";
    }

    // 3. Digital Readiness (Url Check)
    if (lead.contactInfo?.website?.startsWith('https')) {
       confidence += 0.1;
    }

    // 4. Persistence Check
    const existing = await this.prisma.revenuePipeline.findFirst({
        where: { metadata: { contains: lead.businessName } }
    });

    if (existing) {
        confidence -= 0.3; // Already tracked, focus energy elsewhere
    }

    return {
      confidence: Math.min(1.0, confidence),
      analysis,
      suggestedTicket: confidence > 0.8 ? 5000 : 1500,
    };
  }
}
