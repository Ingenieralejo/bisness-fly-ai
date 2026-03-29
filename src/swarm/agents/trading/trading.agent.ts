import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TelegramAgent } from '../notifications/telegram.agent';
import * as cryptoHelper from 'crypto';

export interface MarketSnapshot {
  symbol: string;
  price: number;
  change24h: number;
  volume: number;
}

/**
 * AGENT: TRADING
 * Monitors crypto and forex markets via public APIs.
 * Executes analysis cycles and stores market signals.
 * NOW: Executes live orders via Binance REST API.
 */
@Injectable()
export class TradingAgent {
  private readonly logger = new Logger(TradingAgent.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: TelegramAgent
  ) {}

  /**
   * Execute a full trading analysis cycle
   * Returns crypto and world market snapshots
   */
  async runCycle(): Promise<{ crypto: MarketSnapshot[]; worldMarkets: MarketSnapshot[] }> {
    this.logger.log('📈 TRADING AGENT: Running market analysis cycle (Kelly-Optimized)...');

    const [crypto, worldMarkets] = await Promise.all([
      this.getCryptoSnapshot(),
      this.getWorldMarketSnapshot(),
    ]);

    // 🔒 Fetch Credentials for possible execution
    const binanceCreds = await this.prisma.vaultCredential.findFirst({
      where: { type: 'BINANCE_LIVE' }
    });

    let keys: { apiKey: string; apiSecret: string } | null = null;
    if (binanceCreds && binanceCreds.metadata) {
      const meta = JSON.parse(binanceCreds.metadata);
      if (meta.apiKey && meta.apiSecret) {
        keys = { apiKey: meta.apiKey, apiSecret: meta.apiSecret };
      }
    }

    // Store significant signals with Kelly recommendation
    for (const coin of crypto) {
      if (Math.abs(coin.change24h) > 2) { 
        const { fraction, recommendation } = this.calculateKelly(coin.change24h);
        
        await this.prisma.marketSignal.create({
          data: {
            type: coin.change24h > 0 ? 'CRYPTO_BULL' : 'CRYPTO_BEAR',
            strength: Math.abs(coin.change24h) / 100,
            source: 'binance_live',
            interpretation: recommendation,
            signalStrength: fraction,
            data: JSON.stringify({ ...coin, kellyFraction: fraction }),
            actionable: fraction > 0.1,
          },
        });
        
        this.logger.log(`📊 Kelly Signal: ${coin.symbol} | Rec: ${recommendation} | Change: ${coin.change24h.toFixed(2)}%`);

        // 🔥 AUTONOMOUS EXECUTION TRIGGER
        if (fraction > 0.15 && keys) {
           this.logger.log(`🔥 STRATEGIC TRIGGER: Kelly Alpha > 15%. Initiating execution for ${coin.symbol}...`);
           await this.executeBinanceTrade(coin, fraction, keys);
        }
      }
    }

    this.logger.log('✅ TRADING AGENT: Cycle complete.');
    return { crypto, worldMarkets };
  }

  /**
   * Kelly Criterion formula: f* = (bp - q) / b
   */
  private calculateKelly(priceChange: number): { fraction: number; recommendation: string } {
    const b = 1.5; 
    const p = Math.min(0.8, 0.5 + (Math.abs(priceChange) / 50)); 
    const q = 1 - p;
    const f = (b * p - q) / b;
    const fraction = Math.max(0, f); 
    
    let recommendation = 'HOLD';
    if (fraction > 0) {
      recommendation = priceChange > 0 ? `LONG_TARGET_${(fraction * 10).toFixed(0)}X_LEV` : `SHORT_TARGET_${(fraction * 10).toFixed(0)}X_LEV`;
    }
    
    return {
      fraction,
      recommendation: fraction > 0 ? `${recommendation} (Kelly Allocation: ${(fraction * 100).toFixed(1)}%)` : 'NEUTRAL_WAIT'
    };
  }

  /**
   * Live Order Execution via Binance REST API
   */
  private async executeBinanceTrade(coin: MarketSnapshot, fraction: number, keys: { apiKey: string; apiSecret: string }) {
    try {
      const axios = await import('axios');
      
      // Calculate quantity based on a simulated or real USDT balance
      const account = await this.prisma.economyAccount.findFirst({ where: { currency: 'USDT' } });
      const balance = account?.balance || 1000; // Default to $1000 for simulation if no account found
      
      const riskAmount = balance * fraction;
      const quantity = parseFloat((riskAmount / coin.price).toFixed(5));
      const side = coin.change24h > 0 ? 'BUY' : 'SELL';

      this.logger.log(`💰 Trading Plan: ${side} ${quantity} ${coin.symbol} (Risk: $${riskAmount.toFixed(2)} USDT)`);

      const timestamp = Date.now();
      const queryString = `symbol=${coin.symbol}&side=${side}&type=MARKET&quantity=${quantity}&timestamp=${timestamp}`;
      const signature = cryptoHelper.createHmac('sha256', keys.apiSecret).update(queryString).digest('hex');

      const response = await axios.default.post(
        `https://api.binance.com/api/v3/order?${queryString}&signature=${signature}`,
        {},
        { headers: { 'X-MBX-APIKEY': keys.apiKey } }
      );

      this.logger.log(`🚀 TRADE SUCCESSFUL: ${coin.symbol} ${side} Order ID: ${response.data.orderId}`);

      // Notify Architect
      await this.notifier.sendAlert(`📈 *TRADE EJECUTADO EN BINANCE* \n\nSímbolo: *${coin.symbol}* \nAcción: *${side}* \nCantidad: *${quantity}* \nPrecio: *$${coin.price}* \nID: \`${response.data.orderId}\``);

      // Log Transaction in Matrix
      await this.prisma.economyTransaction.create({
        data: {
          amount: riskAmount,
          type: side === 'BUY' ? 'DEBIT' : 'CREDIT',
          reference: `BINANCE-${response.data.orderId}`,
        }
      });

    } catch (e: any) {
      this.logger.error(`❌ Binance Execution Failed: ${e.response?.data?.msg || e.message}`);
    }
  }

  private async getCryptoSnapshot(): Promise<MarketSnapshot[]> {
    try {
      this.logger.log('🔒 Verifying BINANCE_LIVE Vault Credentials...');
      const binanceCreds = await this.prisma.vaultCredential.findFirst({
        where: { type: 'BINANCE_LIVE' }
      });

      let apiKey = '';
      if (binanceCreds && binanceCreds.metadata) {
        const metadata = JSON.parse(binanceCreds.metadata);
        apiKey = metadata.apiKey || '';
      }

      const axios = await import('axios');
      const symbols = '["BTCUSDT","ETHUSDT","SOLUSDT"]';
      
      const response = await axios.default.get(
        `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbols}`,
        { 
          timeout: 8000,
          headers: apiKey ? { 'X-MBX-APIKEY': apiKey } : {}
        }
      );

      return response.data.map((info: any) => ({
        symbol: info.symbol,
        price: parseFloat(info.lastPrice),
        change24h: parseFloat(info.priceChangePercent),
        volume: parseFloat(info.volume),
      }));
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`⚠️ Binance API connection failed or keys invalid: ${errMsg}`);
      return [
        { symbol: 'BTCUSDT', price: 0, change24h: 0, volume: 0 },
        { symbol: 'ETHUSDT', price: 0, change24h: 0, volume: 0 },
      ];
    }
  }

  private async getWorldMarketSnapshot(): Promise<MarketSnapshot[]> {
    return [
      { symbol: 'SP500', price: 5320, change24h: 0.45, volume: 0 },
      { symbol: 'NASDAQ', price: 16800, change24h: 0.72, volume: 0 },
      { symbol: 'USD/COP', price: 4150, change24h: -0.15, volume: 0 },
    ];
  }
}
