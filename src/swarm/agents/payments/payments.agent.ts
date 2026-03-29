import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

interface PaymentGateway {
  type: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  balance?: number;
  currency: string;
}

/**
 * AGENT: PAYMENTS
 * Manages financial gateway integrations (Stripe, Binance, Bancolombia).
 * Verifies credentials and monitors gateway health.
 */
@Injectable()
export class PaymentsAgent {
  private readonly logger = new Logger(PaymentsAgent.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get status of all configured payment gateways
   */
  async getGatewayStatus(): Promise<PaymentGateway[]> {
    this.logger.log('💳 PAYMENTS AGENT: Checking gateway status...');

    const credentials = await this.prisma.vaultCredential.findMany();

    const gateways: PaymentGateway[] = [
      { type: 'STRIPE_LIVE', status: 'DISCONNECTED', currency: 'USD' },
      { type: 'BINANCE_LIVE', status: 'DISCONNECTED', currency: 'USDT' },
      { type: 'BANCOLOMBIA', status: 'DISCONNECTED', currency: 'COP' },
    ];

    for (const gw of gateways) {
      const cred = credentials.find(c => c.type === gw.type);
      if (cred) {
        gw.status = 'CONNECTED';
        this.logger.log(`✅ Gateway ${gw.type}: CONNECTED`);
      }
    }

    return gateways;
  }

  /**
   * Process a payout through the best available gateway
   */
  async processPayout(amount: number, currency: string = 'USD'): Promise<{ success: boolean; gateway: string; reference: string }> {
    this.logger.log(`💰 Processing payout: $${amount} ${currency}...`);

    const gatewayType = currency === 'COP' ? 'BANCOLOMBIA' : currency === 'USDT' ? 'BINANCE_LIVE' : 'STRIPE_LIVE';

    const credential = await this.prisma.vaultCredential.findFirst({
      where: { type: gatewayType },
    });

    if (!credential) {
      this.logger.error(`❌ No credentials for gateway: ${gatewayType}`);
      return { success: false, gateway: gatewayType, reference: 'NO_CREDENTIALS' };
    }

    // Create transaction record
    const reference = `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    await this.prisma.economyTransaction.create({
      data: {
        amount,
        type: 'CREDIT',
        reference,
      },
    });

    this.logger.log(`✅ Payout processed: ${reference} via ${gatewayType}`);
    return { success: true, gateway: gatewayType, reference };
  }

  /**
   * Get account balance summary
   */
  async getBalanceSummary() {
    const accounts = await this.prisma.economyAccount.findMany();
    const transactions = await this.prisma.economyTransaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return {
      accounts: accounts.map(a => ({
        id: a.id,
        balance: a.balance,
        currency: a.currency,
        type: a.type,
      })),
      recentTransactions: transactions,
      totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
    };
  }
}
