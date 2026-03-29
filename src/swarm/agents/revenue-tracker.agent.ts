import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * AGENT: REVENUE TRACKER
 * Monitors all income streams, validates revenue events,
 * and generates channel health reports.
 */
@Injectable()
export class RevenueTrackerAgent {
  private readonly logger = new Logger(RevenueTrackerAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get health metrics per active revenue channel
   */
  async getChannelHealth() {
    const events = await this.prisma.revenueEvent.findMany({
      where: { type: 'INCOME' },
    });

    const channels: Record<string, { total: number; count: number; verified: number; lastActivity: Date | null }> = {};

    for (const event of events) {
      if (!channels[event.channel]) {
        channels[event.channel] = { total: 0, count: 0, verified: 0, lastActivity: null };
      }
      channels[event.channel].total += event.amount;
      channels[event.channel].count++;
      if (event.isVerified) channels[event.channel].verified++;

      const eventDate = new Date(event.occurredAt);
      if (!channels[event.channel].lastActivity || eventDate > channels[event.channel].lastActivity!) {
        channels[event.channel].lastActivity = eventDate;
      }
    }

    return Object.entries(channels).map(([channel, data]) => ({
      channel,
      totalRevenue: data.total,
      transactionCount: data.count,
      verifiedCount: data.verified,
      verificationRate: data.count > 0 ? (data.verified / data.count) * 100 : 0,
      lastActivity: data.lastActivity,
      health: this.calculateHealth(data),
    }));
  }

  /**
   * Get daily revenue progress
   */
  async getDailyProgress() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await this.prisma.revenueEvent.findMany({
      where: {
        occurredAt: { gte: today },
        type: 'INCOME',
      },
    });

    const totalToday = events.reduce((sum, e) => sum + e.amount, 0);
    const target = 100; // $100 USD daily target

    return {
      date: today.toISOString().split('T')[0],
      earned: totalToday,
      target,
      progress: Math.min((totalToday / target) * 100, 100),
      onTrack: totalToday >= target * 0.5,
      transactions: events.length,
    };
  }

  /**
   * Get revenue breakdown by channel
   */
  async getRevenueByChannel() {
    const events = await this.prisma.revenueEvent.findMany({
      where: { type: 'INCOME' },
    });

    const byChannel: Record<string, number> = {};
    for (const event of events) {
      byChannel[event.channel] = (byChannel[event.channel] || 0) + event.amount;
    }
    return byChannel;
  }

  /**
   * Generate strategic recommendations based on revenue data
   */
  async generateRecommendations(): Promise<string[]> {
    const channelHealth = await this.getChannelHealth();
    const recommendations: string[] = [];

    if (channelHealth.length === 0) {
      recommendations.push('🚀 No revenue channels active. Start with B2B outreach or Fiverr gig setup.');
      return recommendations;
    }

    const topChannel = channelHealth.sort((a, b) => b.totalRevenue - a.totalRevenue)[0];
    recommendations.push(`💡 Double down on ${topChannel.channel} — it's your top performer at $${topChannel.totalRevenue.toFixed(2)}.`);

    const dormant = channelHealth.filter(ch => {
      if (!ch.lastActivity) return true;
      const daysSince = (Date.now() - new Date(ch.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 7;
    });

    for (const ch of dormant) {
      recommendations.push(`⚠️ ${ch.channel} has been dormant for 7+ days. Consider reactivating or reallocating resources.`);
    }

    const unverified = channelHealth.filter(ch => ch.verificationRate < 50 && ch.transactionCount > 0);
    for (const ch of unverified) {
      recommendations.push(`🔍 ${ch.channel} has low verification rate (${ch.verificationRate.toFixed(0)}%). Verify revenue proofs to build credibility.`);
    }

    return recommendations;
  }

  private calculateHealth(data: { total: number; count: number; verified: number; lastActivity: Date | null }): 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL' {
    if (!data.lastActivity) return 'CRITICAL';
    const daysSince = (Date.now() - new Date(data.lastActivity).getTime()) / (1000 * 60 * 60 * 24);

    if (daysSince < 2 && data.total > 50) return 'EXCELLENT';
    if (daysSince < 7 && data.total > 10) return 'GOOD';
    if (daysSince < 14) return 'WARNING';
    return 'CRITICAL';
  }
}
