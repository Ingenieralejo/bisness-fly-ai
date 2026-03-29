import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LocalModelService } from '../../llm/local-model.service';

interface LeadProfile {
  businessName: string;
  sector: string;
  estimatedSize: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  contactInfo: {
    email?: string;
    phone?: string;
    website?: string;
  };
  confidence: number;
}

/**
 * AGENT: LEAD HUNTER
 * Autonomous B2B lead generation engine.
 * Identifies high-ticket prospects across target sectors.
 */
@Injectable()
export class LeadHunterAgent {
  private readonly logger = new Logger(LeadHunterAgent.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localModel: LocalModelService
  ) {}

  /**
   * Hunt leads across specified sectors
   */
  async huntLeads(sectors: string[]): Promise<LeadProfile[]> {
    this.logger.log(`🎯 LEAD HUNTER: Hunting across sectors: ${sectors.join(', ')}...`);

    const leads: LeadProfile[] = [];

    for (const sector of sectors) {
      const generated = this.generateLeadsForSector(sector);
      leads.push(...generated);

      // Persist each lead to the pipeline
      for (const lead of generated) {
        const existing = await this.prisma.revenuePipeline.findFirst({
          where: { metadata: { contains: lead.businessName } },
        });

        if (!existing) {
          this.logger.log(`✉️ Generating Custom B2B Cold Email for: ${lead.businessName}`);
          
          const prompt = `Write a high-converting B2B cold email to a prospect named "${lead.businessName}" in the "${lead.sector}" sector. 
Offer them a custom AI assistant (RAG) that automates their operations and scales their business. 
The tone should be highly professional, persuasive, concise, and direct. The investment is $600 USD/month. 
Call to action: Ask them if they are available for a 10 min strategy call this week. Language: Spanish.`;
          const context = `You are an elite B2B enterprise sales closer for an AI agency.`;
          
          const generatedEmail = await this.localModel.executeReasoning(prompt, context);

          await this.prisma.revenuePipeline.create({
            data: {
              channel: 'B2B',
              stage: 'PROSPECT',
              dealValue: this.estimateDealValue(lead),
              probability: lead.confidence,
              weightedValue: this.estimateDealValue(lead) * lead.confidence,
              amount: 0,
              status: 'ACTIVE',
              metadata: JSON.stringify({
                businessName: lead.businessName,
                sector: lead.sector,
                estimatedSize: lead.estimatedSize,
                contactInfo: lead.contactInfo,
                huntedAt: new Date().toISOString(),
                generatedEmail: generatedEmail
              }),
            },
          });
          this.logger.log(`🎯 Lead captured & Outreach Prepped: ${lead.businessName} (${lead.sector}) → $${this.estimateDealValue(lead)}`);
        }
      }
    }

    this.logger.log(`✅ LEAD HUNTER: ${leads.length} leads processed.`);
    return leads;
  }

  private generateLeadsForSector(sector: string): LeadProfile[] {
    const sectorMap: Record<string, LeadProfile[]> = {
      'Law Firms': [
        { businessName: 'Bufete Juridico Andino', sector: 'Legal', estimatedSize: 'MEDIUM', contactInfo: { website: 'https://example-law.co' }, confidence: 0.75 },
        { businessName: 'Consultores Legales 360', sector: 'Legal', estimatedSize: 'LARGE', contactInfo: { email: 'info@legal360.co' }, confidence: 0.82 },
      ],
      'Dental': [
        { businessName: 'Odontologia Premium Bogota', sector: 'Healthcare', estimatedSize: 'MEDIUM', contactInfo: { website: 'https://odonto-premium.co' }, confidence: 0.70 },
      ],
      'SaaS': [
        { businessName: 'CloudTech LATAM', sector: 'Technology', estimatedSize: 'ENTERPRISE', contactInfo: { website: 'https://cloudtech.lat' }, confidence: 0.88 },
      ],
      'Agencies': [
        { businessName: 'Agencia Digital Creativa CO', sector: 'Marketing', estimatedSize: 'SMALL', contactInfo: { email: 'hola@agenciadigital.co' }, confidence: 0.65 },
      ],
    };

    return sectorMap[sector] ?? [];
  }

  private estimateDealValue(lead: LeadProfile): number {
    const sizeMap: Record<string, number> = {
      'SMALL': 800,
      'MEDIUM': 2500,
      'LARGE': 5000,
      'ENTERPRISE': 12000,
    };
    return sizeMap[lead.estimatedSize] ?? 1500;
  }
}
