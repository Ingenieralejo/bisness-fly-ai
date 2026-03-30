import { Controller, Get, Post, Patch, Body, Param, Query, Logger } from '@nestjs/common';
import { SwarmOrchestrator } from './orchestrator.service';
import { Public } from '../shared/decorators/public.decorator';

import { PrismaService } from '../prisma/prisma.service';

@Controller('wealth-matrix')
export class SwarmController {
  private readonly logger = new Logger(SwarmController.name);

  constructor(
    private readonly wealthMatrix: SwarmOrchestrator,
    private readonly prisma: PrismaService
  ) {}

  // ═══════════════════════════════════════════════════════════════
  //  COMMAND CENTER
  // ═══════════════════════════════════════════════════════════════

  @Get('dashboard')
  async getDashboard() {
    try {
      return await this.wealthMatrix.getCommandCenterData();
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown dashboard error';
      const errStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`DASHBOARD 500 FATAL CRASH: ${errMsg}`, errStack);
      return { data: null, error: { code: 'DASHBOARD_FAILURE', message: errMsg }, meta: { timestamp: new Date().toISOString() } };
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  MARKET SCANNING
  // ═══════════════════════════════════════════════════════════════

  @Post('scan')
  async triggerScan(@Body('region') region?: string) {
    return this.wealthMatrix.executeFullScan(region || 'CO');
  }

  @Post('chat')
  async neuralChat(@Body('prompt') prompt: string) {
    return this.wealthMatrix.neuralChat(prompt);
  }

  // ═══════════════════════════════════════════════════════════════
  //  OPPORTUNITIES
  // ═══════════════════════════════════════════════════════════════

  @Get('opportunities')
  async getOpportunities(@Query('limit') limit?: string) {
    return this.wealthMatrix.getTopOpportunities(parseInt(limit || '20', 10));
  }

  @Post('opportunities/:id/pursue')
  async pursueOpportunity(@Param('id') id: string) {
    return this.wealthMatrix.pursueOpportunity(id);
  }

  // ═══════════════════════════════════════════════════════════════
  //  PIPELINE
  // ═══════════════════════════════════════════════════════════════

  @Get('pipeline')
  async getPipeline(
    @Query('channel') channel?: string,
    @Query('stage') stage?: string,
  ) {
    return this.wealthMatrix.getPipeline({ channel, stage });
  }

  @Post('pipeline')
  async createDeal(@Body() body: {
    channel: string;
    dealValue: number;
    contactMethod?: string;
    notes?: string;
    probability?: number;
  }) {
    return this.wealthMatrix.createDeal(body);
  }

  @Patch('pipeline/:id')
  async updateDeal(
    @Param('id') id: string,
    @Body() body: {
      stage?: string;
      dealValue?: number;
      probability?: number;
      notes?: string;
      lostReason?: string;
      nextFollowUp?: string;
    },
  ) {
    return this.wealthMatrix.updateDeal(id, body);
  }

  // ═══════════════════════════════════════════════════════════════
  //  REVENUE
  // ═══════════════════════════════════════════════════════════════

  @Get('revenue')
  async getRevenueOverview() {
    return this.wealthMatrix.getRevenueOverview();
  }

  @Post('revenue/log')
  async logRevenue(@Body() body: {
    amount: number;
    channel: string;
    source: string;
    description?: string;
    pipelineId?: string;
    isVerified?: boolean;
    proofUrl?: string;
  }) {
    return this.wealthMatrix.logRevenue(body);
  }

  @Get('revenue/daily')
  async getDailyRevenue(@Query('date') date?: string) {
    return this.wealthMatrix.getDailyRevenue(date);
  }

  @Get('revenue/channels')
  async getRevenueByChannel() {
    return this.wealthMatrix.getRevenueByChannel();
  }

  @Post('revenue/:id/verify')
  async verifyRevenue(
    @Param('id') id: string,
    @Body('proofUrl') proofUrl?: string,
  ) {
    return this.wealthMatrix.verifyRevenue(id, proofUrl);
  }

  // ═══════════════════════════════════════════════════════════════
  //  OUTREACH
  // ═══════════════════════════════════════════════════════════════

  @Post('outreach/campaigns')
  async createCampaign(@Body() body: {
    name: string;
    channel: string;
    targetSegment: string;
    totalTargets: number;
  }) {
    return this.wealthMatrix.createCampaign(body);
  }

  @Get('outreach/campaigns')
  async getCampaigns(@Query('status') status?: string) {
    return this.wealthMatrix.getCampaigns(status);
  }

  @Get('outreach/stats')
  async getOutreachStats() {
    return this.wealthMatrix.getCampaignStats();
  }

  @Post('outreach/fire')
  async fireOutreach() {
    return this.wealthMatrix.firePendingOutreach();
  }

  @Post('sniper/launch')
  async launchSniper() {
    return this.wealthMatrix.launchSniperCampaign();
  }

  @Post('king/launch')
  async launchKing() {
    return this.wealthMatrix.launchKingAgent();
  }

  @Get('king/status')
  async getKingStatus() {
    return this.wealthMatrix.getKingStatus();
  }

  // ═══════════════════════════════════════════════════════════════
  //  MARKET SIGNALS
  // ═══════════════════════════════════════════════════════════════

  @Get('signals')
  async getSignals(@Query('limit') limit?: string) {
    return this.wealthMatrix.getMarketSignals(parseInt(limit || '20', 10));
  }

  @Post('materialize-revenue/:id')
  async materializeRevenue(@Param('id') id: string) {
    return this.wealthMatrix.materializeRevenue(id);
  }

  @Public()
  @Post('stripe/webhook')
  async handleStripeWebhook(@Body() payload: any) {
    return this.wealthMatrix.processStripeWebhook(payload);
  }

  @Get('roi')
  async getRoi() {
    return this.wealthMatrix.getCommandCenterData();
  }

  @Post('sync-binance')
  async syncBinance() {
    return this.wealthMatrix.syncBinance();
  }
}
