import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type PipelineStage = 'PROSPECT' | 'CONTACTED' | 'NEGOTIATING' | 'CLOSING' | 'WON' | 'LOST';
export type PipelineChannel = 'B2B' | 'FIVERR' | 'DROPSHIP' | 'AFFILIATE' | 'LEAD_GEN' | (string & {});

interface CreatePipelineDto {
  leadId?: string;
  opportunityId?: string;
  channel: PipelineChannel;
  dealValue: number;
  currency?: string;
  probability?: number;
  contactMethod?: string;
  notes?: string;
}

export interface UpdatePipelineDto {
  stage?: PipelineStage | string;
  dealValue?: number;
  probability?: number;
  notes?: string;
  lostReason?: string;
  nextFollowUp?: string;
}

export interface PipelineSummary {
  totalDeals: number;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  byStage: Record<string, { count: number; value: number }>;
  byChannel: Record<string, { count: number; value: number }>;
  conversionRate: number;
  avgDealSize: number;
  dealsNeedingFollowUp: number;
}

@Injectable()
export class PipelineManagerService {
  private readonly logger = new Logger(PipelineManagerService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Create a new pipeline entry (deal) */
  async createDeal(dto: CreatePipelineDto) {
    const weightedValue = dto.dealValue * (dto.probability ?? 0.5);

    const deal = await this.prisma.revenuePipeline.create({
      data: {
        leadId: dto.leadId,
        opportunityId: dto.opportunityId,
        channel: dto.channel,
        dealValue: dto.dealValue,
        currency: dto.currency ?? 'USD',
        probability: dto.probability ?? 0.5,
        weightedValue,
        contactMethod: dto.contactMethod,
        notes: dto.notes,
        stage: 'PROSPECT',
        metadata: JSON.stringify({ createdAt: new Date().toISOString() }),
        amount: 0,
        status: 'ACTIVE',
      },
    });

    this.logger.log(`💼 New deal created: ${deal.id} | ${dto.channel} | $${dto.dealValue}`);
    return deal;
  }

  /** Advance a deal through the pipeline */
  async updateDeal(dealId: string, dto: UpdatePipelineDto) {
    const existing = await this.prisma.revenuePipeline.findUnique({ where: { id: dealId } });
    if (!existing) {
      throw new Error(`Deal ${dealId} not found`);
    }

    const newProbability = dto.probability ?? existing.probability;
    const newDealValue = dto.dealValue ?? existing.dealValue;
    const weightedValue = newDealValue * newProbability;

    const updateData: Record<string, unknown> = {
      weightedValue,
      lastContactAt: new Date(),
    };

    if (dto.stage) updateData.stage = dto.stage;
    if (dto.dealValue !== undefined) updateData.dealValue = dto.dealValue;
    if (dto.probability !== undefined) updateData.probability = dto.probability;
    if (dto.notes) updateData.notes = dto.notes;
    if (dto.nextFollowUp) updateData.nextFollowUp = new Date(dto.nextFollowUp);
    if (dto.lostReason) updateData.lostReason = dto.lostReason;

    // Auto-set closedAt for terminal stages
    if (dto.stage === 'WON' || dto.stage === 'LOST') {
      updateData.closedAt = new Date();
    }

    const updated = await this.prisma.revenuePipeline.update({
      where: { id: dealId },
      data: updateData,
    });

    this.logger.log(`📈 Deal ${dealId} updated → Stage: ${updated.stage} | Value: $${updated.dealValue}`);
    return updated;
  }

  /** Get full pipeline with optional filters */
  async getPipeline(filters?: { channel?: string; stage?: string }) {
    const where: Record<string, unknown> = {};
    if (filters?.channel) where.channel = filters.channel;
    if (filters?.stage) where.stage = filters.stage;

    return this.prisma.revenuePipeline.findMany({
      where,
      orderBy: [{ stage: 'asc' }, { dealValue: 'desc' }],
    });
  }

  /** Get comprehensive pipeline analytics */
  async getSummary(): Promise<PipelineSummary> {
    const allDeals = await this.prisma.revenuePipeline.findMany();

    const activeDeals = allDeals.filter(d => d.stage !== 'LOST');
    const wonDeals = allDeals.filter(d => d.stage === 'WON');
    const closedDeals = allDeals.filter(d => d.stage === 'WON' || d.stage === 'LOST');

    // Deals needing follow-up (nextFollowUp in past or no followup set while active)
    const now = new Date();
    const dealsNeedingFollowUp = activeDeals.filter(d => {
      if (d.stage === 'WON') return false;
      if (!d.nextFollowUp) return true;
      return new Date(d.nextFollowUp) <= now;
    }).length;

    // By stage breakdown
    const byStage: Record<string, { count: number; value: number }> = {};
    for (const deal of allDeals) {
      if (!byStage[deal.stage]) byStage[deal.stage] = { count: 0, value: 0 };
      byStage[deal.stage].count++;
      byStage[deal.stage].value += deal.dealValue;
    }

    // By channel breakdown
    const byChannel: Record<string, { count: number; value: number }> = {};
    for (const deal of allDeals) {
      if (!byChannel[deal.channel]) byChannel[deal.channel] = { count: 0, value: 0 };
      byChannel[deal.channel].count++;
      byChannel[deal.channel].value += deal.dealValue;
    }

    return {
      totalDeals: allDeals.length,
      totalPipelineValue: activeDeals.reduce((sum, d) => sum + d.dealValue, 0),
      weightedPipelineValue: activeDeals.reduce((sum, d) => sum + d.weightedValue, 0),
      byStage,
      byChannel,
      conversionRate: closedDeals.length > 0 ? wonDeals.length / closedDeals.length : 0,
      avgDealSize: wonDeals.length > 0 ? wonDeals.reduce((sum, d) => sum + d.dealValue, 0) / wonDeals.length : 0,
      dealsNeedingFollowUp,
    };
  }

  /** Get deals that need immediate follow-up */
  async getOverdueFollowUps() {
    const now = new Date();
    return this.prisma.revenuePipeline.findMany({
      where: {
        stage: { notIn: ['WON', 'LOST'] },
        nextFollowUp: { lte: now },
      },
      orderBy: { nextFollowUp: 'asc' },
    });
  }
}
