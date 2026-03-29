/**
 * SHARED INTERFACES — The 1% Standard
 * All entities used across AgentTeams must follow these definitions.
 */

export enum RevenueChannel {
  B2B = 'B2B',
  FIVERR = 'FIVERR',
  DROPSHIP = 'DROPSHIP',
  AFFILIATE = 'AFFILIATE',
  LEAD_GEN = 'LEAD_GEN',
  CRYPTO = 'CRYPTO'
}

export interface RevenueEvent {
  id: string;
  amount: number;
  channel: string;
  type: string;
  occurredAt: Date;
  isVerified: boolean;
  metadata?: string;
  source?: string;
  description?: string;
}

export interface RevenuePipeline {
  id: string;
  channel: string;
  amount: number;
  status: string;
  stage: string;
  dealValue: number;
  probability: number;
  weightedValue: number;
  nextFollowUp?: Date;
  metadata?: string;
  leadId?: string;
}

export interface MarketOpportunity {
  id: string;
  title: string;
  status: string;
  demandScore: number;
  confidence: number;
  marginEstimate?: number;
  sector?: string;
  niche?: string;
  trendDirection?: string;
  entryBarrier?: string;
  competitionLevel?: string;
  metadata?: string;
  data?: string;
}
