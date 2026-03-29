import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface DailyRevenue {
  date: string;
  total: number;
  byChannel: Record<string, number>;
  verified: number;
  unverified: number;
}

export interface RevenueOverview {
  today: DailyRevenue;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
  dailyTarget: number;
  dailyProgress: number;         // percentage toward $100 target
  streak: number;                // consecutive days hitting target
  byChannel: Record<string, number>;
  recentEvents: Array<{
    id: string;
    amount: number;
    channel: string;
    source: string | null;
    description: string | null;
    occurredAt: Date;
    isVerified: boolean;
  }>;
}

@Injectable()
export class RevenueDashboardService {
  private readonly logger = new Logger(RevenueDashboardService.name);
  private readonly DAILY_TARGET = 100; // USD

  constructor(private readonly prisma: PrismaService) {}

  /** Log a revenue event */
  async logRevenue(data: {
    amount: number;
    channel: string;
    source: string;
    description?: string;
    pipelineId?: string;
    isVerified?: boolean;
    proofUrl?: string;
    currency?: string;
  }) {
    const event = await this.prisma.revenueEvent.create({
      data: {
        amount: data.amount,
        channel: data.channel,
        source: data.source,
        description: data.description,
        pipelineId: data.pipelineId,
        isVerified: data.isVerified ?? false,
        verifiedAt: data.isVerified ? new Date() : undefined,
        proofUrl: data.proofUrl,
        currency: data.currency ?? 'USD',
        type: data.amount >= 0 ? 'INCOME' : 'REFUND',
      },
    });

    this.logger.log(`💵 Revenue logged: $${data.amount} | ${data.channel} | ${data.source}`);
    return event;
  }

  /** Get daily revenue breakdown */
  async getDailyRevenue(date?: string): Promise<DailyRevenue> {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const events = await this.prisma.revenueEvent.findMany({
      where: {
        occurredAt: { gte: startOfDay, lte: endOfDay },
        type: 'INCOME',
      },
    });

    const byChannel: Record<string, number> = {};
    let verified = 0;
    let unverified = 0;

    for (const event of events) {
      const ch = event.channel;
      byChannel[ch] = (byChannel[ch] || 0) + event.amount;
      if (event.isVerified) {
        verified += event.amount;
      } else {
        unverified += event.amount;
      }
    }

    return {
      date: startOfDay.toISOString().split('T')[0],
      total: events.reduce((sum, e) => sum + e.amount, 0),
      byChannel,
      verified,
      unverified,
    };
  }

  /** Get channel-level revenue breakdown */
  async getRevenueByChannel(): Promise<Record<string, number>> {
    const events = await this.prisma.revenueEvent.findMany({
      where: { type: 'INCOME' },
    });

    const byChannel: Record<string, number> = {};
    for (const event of events) {
      byChannel[event.channel] = (byChannel[event.channel] || 0) + event.amount;
    }
    return byChannel;
  }

  /** Calculate streak of consecutive days meeting daily target */
  private async calculateStreak(): Promise<number> {
    let streak = 0;
    const today = new Date();

    for (let i = 0; i < 90; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const daily = await this.getDailyRevenue(checkDate.toISOString());

      if (daily.total >= this.DAILY_TARGET) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  /** Full revenue overview for the command center */
  async getOverview(): Promise<RevenueOverview> {
    // Today
    const today = await this.getDailyRevenue();

    // This week
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEvents = await this.prisma.revenueEvent.findMany({
      where: { occurredAt: { gte: weekStart }, type: 'INCOME' },
    });
    const thisWeek = weekEvents.reduce((sum, e) => sum + e.amount, 0);

    // This month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const monthEvents = await this.prisma.revenueEvent.findMany({
      where: { occurredAt: { gte: monthStart }, type: 'INCOME' },
    });
    const thisMonth = monthEvents.reduce((sum, e) => sum + e.amount, 0);

    // All time
    const allEvents = await this.prisma.revenueEvent.findMany({
      where: { type: 'INCOME' },
    });
    const allTime = allEvents.reduce((sum, e) => sum + e.amount, 0);

    // By channel
    const byChannel = await this.getRevenueByChannel();

    // Streak
    const streak = await this.calculateStreak();

    // Recent events
    const recentEvents = await this.prisma.revenueEvent.findMany({
      orderBy: { occurredAt: 'desc' },
      take: 20,
    });

    return {
      today,
      thisWeek,
      thisMonth,
      allTime,
      dailyTarget: this.DAILY_TARGET,
      dailyProgress: Math.min((today.total / this.DAILY_TARGET) * 100, 100),
      streak,
      byChannel,
      recentEvents: recentEvents.map(e => ({
        id: e.id,
        amount: e.amount,
        channel: e.channel,
        source: e.source,
        description: e.description,
        occurredAt: e.occurredAt,
        isVerified: e.isVerified,
      })),
    };
  }

  /** Verify a revenue event (mark as confirmed with proof) */
  async verifyRevenue(eventId: string, proofUrl?: string) {
    return this.prisma.revenueEvent.update({
      where: { id: eventId },
      data: {
        isVerified: true,
        verifiedAt: new Date(),
        proofUrl: proofUrl ?? undefined,
      },
    });
  }
}
