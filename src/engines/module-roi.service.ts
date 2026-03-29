import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Module ROI Service — Tracks profitability per revenue stream
 */
@Injectable()
export class ModuleRoiService {
  private readonly logger = new Logger(ModuleRoiService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get overall and per-module ROI statistics
   */
  async getRoiStats() {
    this.logger.log('📊 Calculating Global ROI matrix...');
    
    // Summary of all income per channel/module
    const totalIncome = await this.prisma.revenueEvent.aggregate({
      _sum: { amount: true },
    });
    
    // Per channel income breakdown
    const channels = ['B2B', 'FIVERR', 'DROPSHIP', 'TRADING', 'CLONES'];
    const channelStats = await Promise.all(channels.map(async (c) => {
        const income = await this.prisma.revenueEvent.aggregate({
            where: { channel: c },
            _sum: { amount: true },
        });
        return { channel: c, totalIncome: income._sum.amount ?? 0 };
    }));
    
    // Sort channels by performance
    const ranking = channelStats.sort((a, b) => b.totalIncome - a.totalIncome);
    
    return {
        totalRevenue: totalIncome._sum.amount ?? 0,
        channelRanking: ranking,
        highestRoi: ranking[0]?.channel ?? 'NONE',
    };
  }
}
