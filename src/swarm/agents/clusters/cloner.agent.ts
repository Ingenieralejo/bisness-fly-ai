import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

interface BizModel {
  slug: string;
  name: string;
  type: string;
  monthlyRevenuePotential: number;
  setupComplexity: 'LOW' | 'MEDIUM' | 'HIGH';
}

/**
 * AGENT: BUSINESS CLONER
 * Scans for replicable digital business models and automates cloning.
 */
@Injectable()
export class BusinessClonerAgent {
  private readonly logger = new Logger(BusinessClonerAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Scan for high-potential business models to clone
   */
  async scanModels(): Promise<BizModel[]> {
    this.logger.log('🧬 CLONER AGENT: Scanning replicable business models...');

    const models: BizModel[] = [
      { slug: 'whatsapp-chatbot-saas', name: 'WhatsApp AI Chatbot SaaS', type: 'B2B', monthlyRevenuePotential: 3000, setupComplexity: 'MEDIUM' },
      { slug: 'legal-rag-platform', name: 'Legal RAG Platform', type: 'B2B', monthlyRevenuePotential: 8000, setupComplexity: 'HIGH' },
      { slug: 'ai-onboarding-tool', name: 'AI Employee Onboarding Tool', type: 'B2B', monthlyRevenuePotential: 5000, setupComplexity: 'MEDIUM' },
    ];

    return models.filter(m => m.monthlyRevenuePotential >= 2000);
  }

  /**
   * Clone (initialize) a business model into the pipeline
   */
  async cloneModel(model: BizModel): Promise<{ status: string; modelSlug: string }> {
    this.logger.log(`🧬 Cloning model: ${model.name} [${model.slug}]...`);

    const existing = await this.prisma.revenuePipeline.findFirst({
      where: { metadata: { contains: model.slug } },
    });

    if (existing) {
      this.logger.log(`⏭️ Model ${model.slug} already in pipeline. Skipping.`);
      return { status: 'ALREADY_EXISTS', modelSlug: model.slug };
    }

    await this.prisma.revenuePipeline.create({
      data: {
        channel: 'B2B',
        stage: 'PROSPECT',
        dealValue: model.monthlyRevenuePotential,
        probability: model.setupComplexity === 'LOW' ? 0.7 : model.setupComplexity === 'MEDIUM' ? 0.5 : 0.3,
        weightedValue: model.monthlyRevenuePotential * 0.5,
        amount: 0,
        status: 'ACTIVE',
        metadata: JSON.stringify({
          modelSlug: model.slug,
          modelName: model.name,
          type: model.type,
          setupComplexity: model.setupComplexity,
          clonedAt: new Date().toISOString(),
        }),
      },
    });

    this.logger.log(`✅ Model cloned: ${model.name} → Pipeline value: $${model.monthlyRevenuePotential}/mo`);
    return { status: 'CLONED', modelSlug: model.slug };
  }
}
