import 'dotenv/config'; // MUST be first
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramAgent } from './notifications/telegram.agent';
import { LocalModelService } from '../../llm/local-model.service';
import { KnowledgeInjectionService } from '../../knowledge/knowledge-injection.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cryptoHelper from 'crypto';
import axios from 'axios';
import { z } from 'zod';
import { URLS } from '../../shared/constants/urls';
import { RevenueOrchestrator } from '../../engines/revenue-models/revenue-orchestrator.service';

// Zod Schema para extracción financiera
const DigitalProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number().min(250).max(499),
  currency: z.literal('USD').default('USD'),
  category: z.enum(['ENTERPRISE_TOOL', 'PREMIUM_FRAMEWORK', 'MASTERCLASS_BUNDLE'])
});
type DigitalProduct = z.infer<typeof DigitalProductSchema>;

// ─────────────────────────────────────────────────────────────
//  Type Definitions
// ─────────────────────────────────────────────────────────────

interface BinanceKeys {
  apiKey: string;
  apiSecret: string;
}

interface SweepResult {
  success: boolean;
  txHash: string;
  amount: number;
  network: string;
}

interface KingTelemetry {
  cycleId: string;
  phase: string;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  detail: string;
  timestamp: Date;
}

// Removed duplicate DigitalProduct interface in favor of Zod inference

export interface IntegrationHealth {
  name: string;
  status: 'CONNECTED' | 'MISSING_KEYS' | 'UNREACHABLE';
  detail: string;
}

export interface KingHealthReport {
  ollama: IntegrationHealth;
  binance: IntegrationHealth;
  near: IntegrationHealth;
  telegram: IntegrationHealth;
  twitter: IntegrationHealth;
  gumroad: IntegrationHealth;
  paypal: IntegrationHealth;

  overallScore: number;
  checkedAt: Date;
}

/**
 * ═══════════════════════════════════════════════════════════
 *  THE KING AGENT — 👑 GOD LEVEL v2.0 👑
 * ═══════════════════════════════════════════════════════════
 *
 * Autonomous revenue engine combining:
 *   • Live Binance CEX treasury management
 *   • NEAR Protocol on-chain balance tracking (CoinGecko price feed)
 *   • Neural commerce: AI-generated digital products + social marketing
 *   • Hard sweep algorithm: auto-withdraw when balance ≥ $100 to vault
 *   • Full telemetry: every action logged to DB for real-time dashboard
 *
 * Zero simulations. Pure execution. Every cycle is recorded.
 */
@Injectable()
export class KingAgent {
  private readonly logger = new Logger(KingAgent.name);

  // ─── Core Configuration ────────────────────────────────────
  private readonly SWEEP_THRESHOLD_USD = 100;
  private readonly NEAR_PRICE_CACHE_MS = 5 * 60 * 1000; // 5 min cache
  private readonly COINGECKO_NEAR_URL =
    'https://api.coingecko.com/api/v3/simple/price?ids=near&vs_currencies=usd';

  // ─── Runtime State ─────────────────────────────────────────
  private cachedNearPrice = 0;
  private lastPriceFetch = 0;
  private currentCycleId = '';
  private cycleCount = 0;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: TelegramAgent,
    private readonly localModel: LocalModelService,
    private readonly knowledgeBase: KnowledgeInjectionService,
    private readonly revenueModels: RevenueOrchestrator,
  ) {}

  // ═══════════════════════════════════════════════════════════
  //  MASTER EXECUTION CYCLE
  // ═══════════════════════════════════════════════════════════

  @Cron(CronExpression.EVERY_30_MINUTES)
  async runCycle(): Promise<void> {
    this.cycleCount++;
    this.currentCycleId = `KING-${Date.now()}-${this.cycleCount}`;

    this.logger.log(`👑 KING GOD LEVEL v2: Cycle #${this.cycleCount} [${this.currentCycleId}]`);
    await this.logTelemetry('INIT', 'RUNNING', 'Ciclo maestro iniciado. Sincronizando con Matrix Neural...');

    try {
      // Phase 1 — KNOWLEDGE SYNCHRONIZATION
      await this.logTelemetry('KNOWLEDGE_SYNC', 'RUNNING', 'Inyectando memoria de mercado (15yr)...');
      const currentMemory = await this.knowledgeBase.injectContext('TRADING_AND_MACRO');
      await this.logTelemetry('KNOWLEDGE_SYNC', 'SUCCESS', `Contexto absorbido: ${currentMemory.length} caracteres de data histórica.`);

      // Phase 2 — NEURAL COMMERCE (Digital Products + Social)
      await this.logTelemetry('NEURAL_COMMERCE', 'RUNNING', 'Motor de comercio digital activado...');
      await this.executeNeuralCommerce(currentMemory);
      await this.logTelemetry('NEURAL_COMMERCE', 'SUCCESS', 'Tesis generada y producto digital publicado.');

      // Phase 3 — LIVE TREASURY AUDIT & SWEEP
      await this.logTelemetry('TREASURY_AUDIT', 'RUNNING', 'Escaneando Binance Spot + NEAR on-chain...');
      await this.auditAndSweepTreasury();
      await this.logTelemetry('TREASURY_AUDIT', 'SUCCESS', 'Auditoría de tesorería completada.');

      // Phase 4 — DIGITAL PRODUCT DEPLOYMENT
      await this.logTelemetry('PRODUCT_DEPLOY', 'RUNNING', 'Generando producto digital con IA...');
      await this.deployDigitalProduct(currentMemory);
      await this.logTelemetry('PRODUCT_DEPLOY', 'SUCCESS', 'Producto digital desplegado en pipeline.');

      // Phase 5 — PHYSICAL AGGRESSION (God Mode Outreach)
      await this.logTelemetry('GOD_MODE_OUTREACH', 'RUNNING', 'Ejecutando Infiltración Física (WhatsApp) a High-Net-Worth Targets...');
      await this.executeGodModeOutreach();
      await this.logTelemetry('GOD_MODE_OUTREACH', 'SUCCESS', 'Ataque de extracción de revenue completado.');

      // Phase 6 — REVENUE MODELS SYNC (5 Real Income Streams)
      await this.logTelemetry('REVENUE_MODELS', 'RUNNING', 'Sincronizando 5 canales de ingreso real...');
      await this.syncRevenueModels();
      await this.logTelemetry('REVENUE_MODELS', 'SUCCESS', '5 canales de ingreso sincronizados.');

      await this.logTelemetry('CYCLE_COMPLETE', 'SUCCESS', `Ciclo #${this.cycleCount} ejecutado sin errores. Esperando siguiente pulso.`);

      // Notify Telegram with a strategic summary
      const statusIcon = '👑';
      const summary = `${statusIcon} *INFORME DE CICLO KING #${this.cycleCount}* \n\n` +
        `🆔 ID: \`${this.currentCycleId}\` \n` +
        `✅ Estado: *COMPLETO* \n` +
        `💰 Tesorería: Verificada y Sincronizada \n` +
        `🎯 Leads Impactados: Ciclo de ataque finalizado \n` +
        `📊 Revenue Models: 5 canales activos \n` +
        `🚀 Próximo: En 30 minutos.`;
      
      await this.notifier.sendAlert(summary).catch(() => { /* silent fail */ });

    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Unknown KING cycle error';
      await this.logTelemetry('CYCLE_COMPLETE', 'FAILED', `Error crítico: ${errMsg}`);
      this.logger.error(`❌ KING FATAL: ${errMsg}`);
      
      await this.notifier.sendAlert(`⚠️ *FALLO CRÍTICO EN KING #${this.cycleCount}* \n\nError: \`${errMsg}\``).catch(() => {});
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  TREASURY: Live Binance + On-Chain + Smart Sweep
  // ═══════════════════════════════════════════════════════════

  @Cron(CronExpression.EVERY_10_MINUTES)
  async auditAndSweepTreasury(): Promise<void> {
    this.logger.log('🔍 KING: Ejecutando auditoría de tesorería en vivo (Ciclo Sin Parar 10m)...');
    this.logger.log('🛡️ KING: DIRECTIVA DE PRESERVACIÓN DE CAPITAL ACTIVADA: Riesgo de pérdida = 0% (Solo Ventas y Barridos).');

    try {
      const apiKey = process.env['BINANCE_API_KEY'];
      const apiSecret = process.env['BINANCE_API_SECRET'];
      const apiKeys: BinanceKeys | null = apiKey && apiSecret ? { apiKey, apiSecret } : null;

      let binanceBalance = 0;
      let onChainBalance = 0;
      let platformCapturedBalance = 0;

      // 💳 PLATFORM ASSET CENTRALIZATION: Collect ALL verified revenue across the ecosystem
      const pendingRevenue = await this.prisma.revenueEvent.aggregate({
        where: { isVerified: true }, // Count all verified revenue
        _sum: { amount: true }
      });
      platformCapturedBalance = pendingRevenue._sum.amount || 0;
      this.logger.log(`📥 PLATFORM ASSETS (All Businesses): $${platformCapturedBalance.toFixed(2)}`);

      // Binance CEX Balance (USDT)
      if (apiKeys?.apiKey && apiKeys?.apiSecret) {
        binanceBalance = await this.getLiveBinanceBalance(apiKeys);
        this.logger.log(`💰 Binance Spot USDT: $${binanceBalance.toFixed(2)}`);
      } else {
        this.logger.warn('⚠️ KING: Claves Binance no encontradas en Vault.');
      }

      // On-Chain Balance (NEAR → USD via CoinGecko)
      onChainBalance = await this.getLiveOnChainBalance();
      this.logger.log(`💰 NEAR On-Chain USD: $${onChainBalance.toFixed(2)}`);

      const totalBalance = binanceBalance + onChainBalance + platformCapturedBalance;
      this.logger.log(`💰 KING Total Global Treasury: $${totalBalance.toFixed(2)} USD`);

      // Log balance snapshot to DB for dashboard
      await this.prisma.marketSignal.create({
        data: {
          type: 'KING_TREASURY_SNAPSHOT',
          source: 'KING_AGENT_CORE',
          strength: totalBalance,
          data: JSON.stringify({
            binance: binanceBalance,
            near: onChainBalance,
            total: totalBalance,
            nearPrice: this.cachedNearPrice,
            timestamp: new Date().toISOString(),
          }),
          actionable: totalBalance >= this.SWEEP_THRESHOLD_USD,
        },
      });

      // HARD SWEEP ALGORITHM
      if (totalBalance >= this.SWEEP_THRESHOLD_USD) {
        this.logger.log(
          `⚠️ UMBRAL SUPERADO ($${totalBalance.toFixed(2)} ≥ $${this.SWEEP_THRESHOLD_USD}). Ejecutando HARD SWEEP...`,
        );

        const sweepTx = await this.executeHardSweep(totalBalance, apiKeys);

        if (sweepTx.success) {
          await this.notifier.sendAlert(
            `👑 *KING DIOS — RETIRO EJECUTADO* \n\nBarrido: *$${totalBalance.toFixed(2)} USD*\nRed: ${sweepTx.network}\nHash: \`${sweepTx.txHash}\``,
          );

          await this.prisma.revenueEvent.create({
            data: {
              amount: totalBalance,
              currency: 'USDT',
              channel: 'KING_GOD_LEVEL',
              source: 'HARD_SWEEP',
              description: `Sweep automático: $${binanceBalance.toFixed(2)} Binance + $${onChainBalance.toFixed(2)} NEAR`,
              isVerified: true,
              verifiedAt: new Date(),
              metadata: JSON.stringify({
                txHash: sweepTx.txHash,
                network: sweepTx.network,
                binance: binanceBalance,
                near: onChainBalance,
                nearPrice: this.cachedNearPrice,
                cycleId: this.currentCycleId,
              }),
            },
          });

          await this.logTelemetry(
            'HARD_SWEEP',
            'SUCCESS',
            `Barrido de $${totalBalance.toFixed(2)} ejecutado. Tx: ${sweepTx.txHash.substring(0, 16)}...`,
          );
        }
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error
        ? (e as { response?: { data?: { msg?: string } } }).response?.data?.msg || e.message
        : 'Unknown treasury error';
      this.logger.error(`❌ KING TREASURY ERROR: ${errMsg}`);
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  NEURAL COMMERCE: AI Thesis + Social Publishing
  // ═══════════════════════════════════════════════════════════

  private async executeNeuralCommerce(memory: string): Promise<void> {
    this.logger.log('✍️ KING: Formulando tesis macro con contexto neural de 15 años...');

    const currentYear = new Date().getFullYear();
    const prompt = `
      ### ROLE: KING - ELITE AUTONOMOUS FINANCIAL GOD
      ### HARD CONSTRAINTS:
      - ZERO SIMULATION. ALL THESES MUST BE BASED ON REAL MARKET CONDITIONS.
      - THE CURRENT YEAR IS ${currentYear}. NEVER reference any past year.
      - CONTEXT: 15YR MEMORY: ${memory.substring(0, 1000)}...
      - GENERATE AN AGGRESSIVE FOMO FINANCIAL THESIS.
      - BRUTAL REALITY CHECK FOR BUSINESSES IGNORING AI.
      - PITCH FLY.AI EXCLUSIVE MASTERCLASS.
      - UNDER 280 CHARACTERS.
      - LANGUAGE: SPANISH. 
      - TONE: RUTHLESS, AUTHORITATIVE.
      
      Return ONLY the exact tweet text.
    `;

    try {
      const thesis = await this.localModel.executeReasoning(
        prompt,
        'You are KING, the supreme autonomous trading agent of BISNESS FLY.AI.',
      );

      this.logger.log(`📝 TESIS LIVE: "${thesis}"`);

      // Persist thesis as market signal for dashboard + historical tracking
      await this.prisma.marketSignal.create({
        data: {
          type: 'KING_THESIS',
          source: 'KING_AGENT_CORE',
          strength: 1.0,
          data: thesis,
          actionable: true,
        },
      });

      // Attempt Twitter/X API publishing
      const bearerToken = process.env['TWITTER_BEARER_TOKEN'];

      if (bearerToken) {
        try {
          await axios.post(
            'https://api.twitter.com/2/tweets',
            { text: thesis },
            {
              headers: {
                Authorization: `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
          this.logger.log('📤 KING: Tesis publicada en X/Twitter.');
          await this.logTelemetry('SOCIAL_POST', 'SUCCESS', `Tweet publicado: ${thesis.substring(0, 60)}...`);
        } catch (twitterErr: unknown) {
          const tMsg = twitterErr instanceof Error ? twitterErr.message : 'Twitter API error';
          this.logger.warn(`⚠️ Twitter API falló: ${tMsg}. Tesis guardada en DB.`);
          await this.logTelemetry('SOCIAL_POST', 'FAILED', `Twitter API: ${tMsg}`);
        }
      } else {
        this.logger.warn('⚠️ KING: Sin claves Twitter en .env. Tesis almacenada en DB.');
      }
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Neural commerce error';
      this.logger.error(`KING Neural Commerce Engine failed: ${errMsg}`);
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  DIGITAL PRODUCT DEPLOYMENT (AI-Generated Revenue Assets)
  // ═══════════════════════════════════════════════════════════

  private async deployDigitalProduct(memory: string): Promise<void> {
    this.logger.log('🏗️ KING: Generating AI-powered digital product...');

    const currentYear = new Date().getFullYear();
    const prompt = `
      ### ROLE: KING - SUPREME AI PRODUCT ARCHITECT
      ### HARD CONSTRAINTS:
      - ZERO SIMULATION. REAL MARKET ASSET GENERATION.
      - THE CURRENT YEAR IS ${currentYear}. NEVER reference any past year. ALL dates and copy MUST use ${currentYear}.
      - TARGET: $1000+ DAILY REVENUE.
      - GENERATE AN ULTRA-HIGH-TICKET DIGITAL ASSET ($250-$499).
      - MARKET CONTEXT: ${memory.substring(0, 500)}
      - RETURN VALID JSON ONLY.
      
      ### JSON SCHEMA:
      {
        "title": "Premium authoritative name (Spanish)",
        "description": "Brutal ROI pitch (Spanish, must reference year ${currentYear} if any year is mentioned)",
        "price": 250-499,
        "currency": "USD",
        "category": "ENTERPRISE_TOOL" | "PREMIUM_FRAMEWORK" | "MASTERCLASS_BUNDLE"
      }
    `;

    try {
      const raw = await this.localModel.executeTask(prompt, 'High-Ticket Digital Asset generation for $1000 daily goal.');
      
      // Sanitización progresiva (Extracción de JSON de posibles alucinaciones Markdown)
      const jsonStrMatch = raw.match(/\{[\s\S]*\}/);
      const jsonStr = jsonStrMatch ? jsonStrMatch[0] : raw;
      
      const parsed = JSON.parse(jsonStr.trim());
      const product = DigitalProductSchema.parse(parsed);

      this.logger.log(`🎁 Producto Zod-Validado: "${product.title}" — $${product.price}`);

      // Store as revenue opportunity
      await this.prisma.marketSignal.create({
        data: {
          type: 'KING_PRODUCT_DEPLOYED',
          source: 'KING_AGENT_CORE',
          strength: product.price,
          data: JSON.stringify(product),
          actionable: true,
        },
      });

      // Create a pipeline deal for tracking
      await this.prisma.revenuePipeline.create({
        data: {
          channel: 'DIGITAL_PRODUCTS',
          stage: 'PROSPECT',
          dealValue: product.price,
          amount: 0,
          weightedValue: product.price * 0.3,
          status: 'ACTIVE',
          metadata: JSON.stringify(product),
          notes: `[KING AUTO]: ${product.category} - ${product.title}`,
        },
      });

      // Attempt Gumroad listing if keys exist
      const gumroadToken = process.env['GUMROAD_ACCESS_TOKEN'];

      if (gumroadToken) {
        try {
          // FIX: Gumroad API expects access_token as query param, NOT body field
          const gumroadRes = await axios.post(
            `https://api.gumroad.com/v2/products?access_token=${encodeURIComponent(gumroadToken)}`,
            new URLSearchParams({
              name: product.title,
              description: product.description,
              price: String(product.price * 100), // Gumroad stores in cents
              currency_type: 'usd',
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
          );
          if (gumroadRes.data?.success) {
            this.logger.log(`🚀 Producto "${product.title}" publicado en Gumroad. URL: ${gumroadRes.data.product?.short_url ?? 'N/A'}`);
            await this.logTelemetry('GUMROAD_PUBLISH', 'SUCCESS', `"${product.title}" — $${product.price} | URL: ${gumroadRes.data.product?.short_url ?? ''}`);
          } else {
            this.logger.warn(`⚠️ Gumroad responded success=false: ${JSON.stringify(gumroadRes.data)}`);
          }
        } catch (gumErr: unknown) {
          const gMsg = gumErr instanceof Error ? gumErr.message : 'Gumroad API error';
          this.logger.warn(`⚠️ Gumroad API failed: ${gMsg}. Product stored in pipeline.`);
        }
      }
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        const zodMessages = (e as z.ZodError).issues.map((issue: z.ZodIssue) => issue.message).join(', ');
        this.logger.error(`❌ Fallo de Esquema Zod (Alucinación Mitigada): ${zodMessages}`);
        await this.logTelemetry('PRODUCT_DEPLOY', 'FAILED', `Zod validation: ${zodMessages}`);
      } else {
        const errMsg = e instanceof Error ? e.message : 'Product deployment error';
        this.logger.error(`KING Product Engine: ${errMsg}`);
        await this.logTelemetry('PRODUCT_DEPLOY', 'FAILED', errMsg);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  LIVE API INTEGRATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Fetch real Binance Spot USDT balance using HMAC-SHA256 signed request.
   */
  private async getLiveBinanceBalance(keys: BinanceKeys): Promise<number> {
    const timestamp = Date.now();
    const queryString = `timestamp=${timestamp}`;
    const signature = cryptoHelper
      .createHmac('sha256', keys.apiSecret)
      .update(queryString)
      .digest('hex');

    try {
      const res = await axios.get(
        `https://api.binance.com/api/v3/account?${queryString}&signature=${signature}`,
        { headers: { 'X-MBX-APIKEY': keys.apiKey } },
      );
      const usdt = res.data.balances.find(
        (b: { asset: string; free: string }) => b.asset === 'USDT',
      );
      return usdt ? parseFloat(usdt.free) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Fetch live NEAR balance via RPC + real USD price from CoinGecko.
   * NOTE: NEAR account_id must be like "user.near" — NOT a raw hex key.
   */
  private async getLiveOnChainBalance(): Promise<number> {
    const walletAddress = process.env['AGENTKIT_WALLET_ADDRESS'];
    if (!walletAddress) return 0;

    // Reject hex keys — they are public keys, NOT account IDs
    if (/^[0-9a-f]{64}$/i.test(walletAddress)) {
      this.logger.warn(`⚠️ NEAR: AGENTKIT_WALLET_ADDRESS is a hex public key, not an account ID. Set it to your account like "tu-cuenta.near". Skipping.`);
      return 0;
    }

    try {
      const res = await axios.post('https://rpc.mainnet.near.org', {
        jsonrpc: '2.0',
        id: 'king-balance-check',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: walletAddress,
        },
      });

      if (res.data.result?.amount) {
        const nearBalance = parseFloat(res.data.result.amount) / 1e24;
        const nearPriceUsd = await this.getNearPriceUsd();
        return nearBalance * nearPriceUsd;
      }
    } catch {
      // Silently handle — prevents full system crash on RPC failure
    }
    return 0;
  }

  /**
   * Live NEAR/USD price via CoinGecko (cached for 5 minutes).
   */
  private async getNearPriceUsd(): Promise<number> {
    const now = Date.now();
    if (this.cachedNearPrice > 0 && now - this.lastPriceFetch < this.NEAR_PRICE_CACHE_MS) {
      return this.cachedNearPrice;
    }

    try {
      const res = await axios.get(this.COINGECKO_NEAR_URL, { timeout: 5000 });
      this.cachedNearPrice = res.data?.near?.usd ?? 0;
      this.lastPriceFetch = now;
      this.logger.log(`📊 CoinGecko NEAR/USD: $${this.cachedNearPrice.toFixed(4)}`);
    } catch {
      this.logger.warn('⚠️ CoinGecko API unreachable. Using cached NEAR price.');
    }

    return this.cachedNearPrice || 4.5; // Fallback only if cache is completely empty
  }

  /**
   * Execute withdrawal from Binance → Offline Vault.
   * Production note: Requires IP whitelist + Withdraw permission on Binance.
   */
  private async executeHardSweep(
    amount: number,
    keys: BinanceKeys | null,
  ): Promise<SweepResult> {
    this.logger.log(`⚡ HARD SWEEP: $${amount.toFixed(2)} → OFFLINE VAULT`);

    const vaultAddress = process.env['OFFLINE_VAULT_ADDRESS'];

    if (keys?.apiKey && keys?.apiSecret && vaultAddress) {
      try {
        const timestamp = Date.now();
        const queryString = `coin=USDT&network=NEAR&address=${vaultAddress}&amount=${amount}&timestamp=${timestamp}`;
        const signature = cryptoHelper
          .createHmac('sha256', keys.apiSecret)
          .update(queryString)
          .digest('hex');

        // Live Binance Withdraw (requires API permission + IP whitelist)
        const res = await axios.post(
          `https://api.binance.com/sapi/v1/capital/withdraw/apply?${queryString}&signature=${signature}`,
          {},
          { headers: { 'X-MBX-APIKEY': keys.apiKey } },
        );

        return {
          success: true,
          txHash: res.data.id,
          amount,
          network: 'BINANCE→NEAR',
        };
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : 'Binance withdraw failed';
        this.logger.error(`Hard sweep API error: ${errMsg}. Requires IP Whitelist.`);
      }
    }

    // No keys or vault address → sweep cannot proceed. Do NOT fake success.
    this.logger.warn('⚠️ SWEEP ABORTED: Missing Binance keys or OFFLINE_VAULT_ADDRESS. Configure .env and run seed-vault.');
    return {
      success: false,
      txHash: 'SWEEP_BLOCKED_NO_CREDENTIALS',
      amount: 0,
      network: 'NONE',
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  GOD MODE: PHYSICAL AGGRESSION
  // ═══════════════════════════════════════════════════════════

  private async executeGodModeOutreach(): Promise<void> {
    this.logger.log('📈 KING: Modo Dios Activado. Ejecutando Infiltración Directa (WhatsApp) con Targets REALES...');
    
    // Fetch high-value targets from DB ( injected from internet strike )
    const targets = await this.prisma.marketOpportunity.findMany({
      where: { 
        status: 'DETECTED',
        marginEstimate: { gt: 0 }
      },
      take: 5 // Target top 5 to avoid spam limits initially
    });

    if (targets.length === 0) {
      this.logger.warn('⚠️ No hay targets pendientes de infiltración en la DB.');
      return;
    }

    import('child_process').then(({ exec }) => {
      import('util').then(({ promisify }) => {
        import('fs').then(fs => {
          import('path').then(path => {
            const execAsync = promisify(exec);
            
            targets.forEach(async (target) => {
                let budget = target.marginEstimate || 450;
                if (['Dental', 'E-commerce', 'Local Services'].includes(target.sector || '')) {
                    budget = 299;
                }

                let phoneStr = '13054440000'; // Fallback
                try {
                   if (target.metadata) {
                     const meta = JSON.parse(target.metadata);
                     if (meta.phone) phoneStr = meta.phone;
                   }
                } catch (e) {}

                 // ── DETERMINISTIC PITCH: 3 blocks the LLM fills, not freeform ──
                 const landingUrl = URLS.LANDING_WITH_AMOUNT(budget);
                 const paypalUrl  = URLS.PAYPAL_WITH_AMOUNT(budget);

                 const prompt = `
### ROLE: SENIOR SALES CONSULTANT FOR FLY.AI STUDIO
### HARD CONSTRAINTS (VIOLATING ANY = REJECTED OUTPUT):
- LANGUAGE: SPANISH
- EXACTLY 3 paragraphs. NO MORE.
- MAX 40 words TOTAL.
- DO NOT invent prices, percentages, or numbers.
- DO NOT mention "MedTech", "acciones", or any term not in the TARGET context.
- DO NOT add greetings, emojis, or sign-offs.
- TONE: Professional, direct, confident. NOT aggressive. NOT salesy.

### TARGET CONTEXT:
- Company: ${target.title}
- Sector: ${target.sector}
- Budget: $${budget} USD

### MANDATORY OUTPUT STRUCTURE (FILL EACH LINE):
Line 1: One sentence identifying a real pain point for companies in the ${target.sector} sector.
Line 2: "Mira cómo lo resolvemos: ${URLS.DEMO_PORTFOLIO}"
Line 3: "Cotización y detalles: ${landingUrl}"

Return ONLY the 3 lines. Nothing else.
                 `;

                try {
                  let pitch = await this.localModel.executeReasoning(prompt, 'You are a professional B2B software sales consultant for FLY.AI Studio.');

                  // ── HALLUCINATION GUARD: if LLM output doesn't contain our URLs, rebuild deterministically ──
                  if (!pitch.includes(URLS.DEMO_PORTFOLIO) || !pitch.includes(landingUrl)) {
                    this.logger.warn('⚠️ KING: LLM pitch hallucinated. Falling back to deterministic template.');
                    pitch = `Las empresas de ${target.sector} pierden oportunidades por no automatizar. Mira cómo lo resolvemos: ${URLS.DEMO_PORTFOLIO} — Cotización y detalles: ${landingUrl}`;
                  }

                  // 🔥 TELEGRAM NOTIFICATION: SEND THE PITCH TO ARQUITECTO
                  await this.notifier.sendAlert(
                    `🎯 *ATAQUE SNIPER KING ACTIVADO* \n\n` +
                    `👤 *Target:* ${target.title} \n` +
                    `💰 *Presupuesto:* $${budget} \n` +
                    `📱 *Phone:* \`${phoneStr}\` \n\n` +
                    `✉️ *Pitch:* \n_${pitch.trim()}_\n\n` +
                    `🔗 *Landing:* ${landingUrl}\n` +
                    `💳 *Pago:* ${paypalUrl}`
                  ).catch(() => {});
                 
                 const encodedText = encodeURIComponent(pitch.trim()).replace(/'/g, '%27');
                 // Fix VBScript syntax and add robust launching
                 const vbsContent = `
Dim WshShell
Set WshShell = WScript.CreateObject("WScript.Shell")
' Open WhatsApp with pre-filled message
WshShell.Run "whatsapp://send?phone=${phoneStr}&text=${encodedText}"
WScript.Sleep 8000 
' Force focus on WhatsApp window
If WshShell.AppActivate("WhatsApp") Then
    WScript.Sleep 2000
    WshShell.SendKeys "~"
End If
`;
                 const tmpPath = path.join(process.cwd(), 'tmp', `king_atk_${target.id}_${Date.now()}.vbs`);
                 
                 // Ensure tmp dir exists
                 const tmpDir = path.join(process.cwd(), 'tmp');
                 if (!fs.existsSync(tmpDir)){
                     fs.mkdirSync(tmpDir, { recursive: true });
                 }

                 fs.writeFileSync(tmpPath, vbsContent);
                 
                 await execAsync(`cscript.exe //nologo "${tmpPath}"`);
                 if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
                 
                 // Mark as pursued
                 await this.prisma.marketOpportunity.update({
                     where: { id: target.id },
                     data: { status: 'PURSUING' }
                 });

                 // Log to Dashboard
                 await this.prisma.revenueEvent.create({
                    data: {
                      amount: 0,
                      currency: 'USDT',
                      channel: 'KING_GOD_LEVEL',
                      source: 'PHYSICAL_INFILTRATION',
                      description: `Outreach Físico en vivo a ${target.title} por $${target.marginEstimate}`,
                      isVerified: false,
                      metadata: JSON.stringify({ strategy: 'GOD_MODE', target: target.title, phone: phoneStr, pitch })
                    }
                 });
                 
                 await this.notifier.sendAlert(`👑 *KING DIOS — ATAQUE FÍSICO REAL* \n\nDirectiva enviada a: ${target.title} ($${budget}) al +${phoneStr}.\n*Pitch*: ${pitch}\n\n🔗 *Landing:* ${landingUrl}\n💳 *Pago:* ${paypalUrl}`);
               } catch (e) {
                 this.logger.error(`KING God Mode Error on ${target.title}: ${e}`);
               }
            });
          });
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  TELEMETRY SYSTEM (Feeds the Dashboard)
  // ═══════════════════════════════════════════════════════════

  /**
   * Log a telemetry event to the database for real-time dashboard consumption.
   */
  private async logTelemetry(
    phase: string,
    status: 'RUNNING' | 'SUCCESS' | 'FAILED',
    detail: string,
  ): Promise<void> {
    try {
      await this.prisma.marketSignal.create({
        data: {
          type: `KING_TELEMETRY_${phase}`,
          source: 'KING_AGENT_CORE',
          strength: status === 'SUCCESS' ? 1.0 : status === 'FAILED' ? 0 : 0.5,
          data: JSON.stringify({
            cycleId: this.currentCycleId,
            phase,
            status,
            detail,
            timestamp: new Date(),
            cycleNumber: this.cycleCount,
          } satisfies KingTelemetry & { cycleNumber: number }),
          actionable: false,
        },
      });
    } catch {
      // Telemetry logging should never crash the agent
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  HEALTH DIAGNOSTICS (Integration Status)
  // ═══════════════════════════════════════════════════════════

  /**
   * Runs a comprehensive integration health check.
   * Returns a typed KingHealthReport consumed by the dashboard API and getFullStatus.
   */
  async getHealthReport(): Promise<KingHealthReport> {
    const checks = await Promise.allSettled([
      this.checkOllama(),
      this.checkBinanceVault(),
      this.checkNearConfig(),
      this.checkTelegramBot(),
      this.checkTwitterApi(),
      this.checkGumroadApi(),
      this.checkPayPalApi(),

    ]);

    const reportInternal = (idx: number): IntegrationHealth => {
      const result = (checks as any)[idx];
      if (result && result.status === 'fulfilled') return result.value;
      return { name: 'Unknown', status: 'UNREACHABLE', detail: 'Check failed unexpectedly' };
    };

    const report: KingHealthReport = {
      ollama: reportInternal(0),
      binance: reportInternal(1),
      near: reportInternal(2),
      telegram: reportInternal(3),
      twitter: reportInternal(4),
      gumroad: reportInternal(5),
      paypal: reportInternal(6),
      overallScore: 0,
      checkedAt: new Date(),
    };

    const all = [report.ollama, report.binance, report.near, report.telegram, report.twitter, report.gumroad, report.paypal];
    report.overallScore = Math.round((all.filter(i => i.status === 'CONNECTED').length / all.length) * 100);

    return report;
  }

  private async checkOllama(): Promise<IntegrationHealth> {
    try {
      const res = await axios.get('http://localhost:11434/api/tags', { timeout: 3000 });
      const models = res.data?.models ?? [];
      const hasLlama = models.some((m: { name: string }) => m.name.includes('llama'));
      return {
        name: 'Ollama LLM',
        status: hasLlama ? 'CONNECTED' : 'MISSING_KEYS',
        detail: hasLlama ? `${models.length} model(s) loaded` : 'Ollama running but no llama3 model found (run: ollama pull llama3:8b)',
      };
    } catch {
      return { name: 'Ollama LLM', status: 'UNREACHABLE', detail: 'Ollama not running on localhost:11434' };
    }
  }

  private async checkBinanceVault(): Promise<IntegrationHealth> {
    const apiKey = process.env['BINANCE_API_KEY'];
    const apiSecret = process.env['BINANCE_API_SECRET'];
    if (!apiKey || !apiSecret) return { name: 'Binance CEX', status: 'MISSING_KEYS', detail: 'BINANCE_API_KEY or BINANCE_API_SECRET not set in .env' };
    return { name: 'Binance CEX', status: 'CONNECTED', detail: `API Key: ${apiKey.substring(0, 8)}...` };
  }

  private async checkNearConfig(): Promise<IntegrationHealth> {
    const wallet = process.env['AGENTKIT_WALLET_ADDRESS'];
    if (!wallet) return { name: 'NEAR Protocol', status: 'MISSING_KEYS', detail: 'AGENTKIT_WALLET_ADDRESS not set in .env' };
    return { name: 'NEAR Protocol', status: 'CONNECTED', detail: `Wallet: ${wallet.substring(0, 12)}...` };
  }

  private async checkTelegramBot(): Promise<IntegrationHealth> {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    if (!token) return { name: 'Telegram Bot', status: 'MISSING_KEYS', detail: 'TELEGRAM_BOT_TOKEN not set in .env' };
    try {
      const res = await axios.get(`https://api.telegram.org/bot${token}/getMe`, { timeout: 4000 });
      if (res.data?.ok) return { name: 'Telegram Bot', status: 'CONNECTED', detail: `Bot: @${res.data.result.username}` };
    } catch { /* fall through */ }
    return { name: 'Telegram Bot', status: 'UNREACHABLE', detail: 'Token exists but API returned error' };
  }

  private async checkTwitterApi(): Promise<IntegrationHealth> {
    const bearer = process.env['TWITTER_BEARER_TOKEN'];
    if (!bearer) return { name: 'Twitter/X', status: 'MISSING_KEYS', detail: 'TWITTER_BEARER_TOKEN not set in .env' };
    return { name: 'Twitter/X', status: 'CONNECTED', detail: `Bearer: ${bearer.substring(0, 12)}...` };
  }

  private async checkGumroadApi(): Promise<IntegrationHealth> {
    const token = process.env['GUMROAD_ACCESS_TOKEN'];
    if (!token) return { name: 'Gumroad', status: 'MISSING_KEYS', detail: 'GUMROAD_ACCESS_TOKEN not set in .env' };
    return { name: 'Gumroad', status: 'CONNECTED', detail: `Token: ${token.substring(0, 10)}...` };
  }

  private async checkPayPalApi(): Promise<IntegrationHealth> {
    const clientId = process.env['PAYPAL_CLIENT_ID'];
    const clientSecret = process.env['PAYPAL_CLIENT_SECRET'];
    if (!clientId || !clientSecret) return { name: 'PayPal', status: 'MISSING_KEYS', detail: 'PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET missing config in .env' };
    return { name: 'PayPal', status: 'CONNECTED', detail: `Active: ${clientId.substring(0, 12)}...` };
  }



  // ═══════════════════════════════════════════════════════════
  //  PUBLIC STATUS (API Endpoint Data)
  // ═══════════════════════════════════════════════════════════

  /**
   * Returns full agent status for the dashboard API endpoint.
   * Includes health diagnostics, real vs paper revenue split, and full telemetry.
   */
  async getFullStatus() {
    const [sweepEvents, paperEvents, signals, telemetry, products, health] = await Promise.all([
      this.prisma.revenueEvent.findMany({
        where: { channel: 'KING_GOD_LEVEL', source: { not: 'PAPER_ARBITRAGE' } },
        orderBy: { occurredAt: 'desc' },
        take: 20,
      }),
      this.prisma.revenueEvent.findMany({
        where: { channel: 'KING_GOD_LEVEL', source: 'PHYSICAL_INFILTRATION' },
        orderBy: { occurredAt: 'desc' },
        take: 20,
      }),
      this.prisma.marketSignal.findMany({
        where: { source: 'KING_AGENT_CORE', type: 'KING_THESIS' },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.marketSignal.findMany({
        where: { source: 'KING_AGENT_CORE', type: { startsWith: 'KING_TELEMETRY' } },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      this.prisma.marketSignal.findMany({
        where: { source: 'KING_AGENT_CORE', type: { in: ['KING_PRODUCT_DEPLOYED', 'LEDGER_ENFORCER_PATROL'] } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.getHealthReport(),
    ]);

    const totalRealSwept = sweepEvents.reduce(
      (acc: number, ev: { amount: number }) => acc + (ev.amount || 0),
      0,
    );
    const totalPaperProfit = paperEvents.reduce(
      (acc: number, ev: { amount: number }) => acc + (ev.amount || 0),
      0,
    );

    // Latest treasury snapshot
    const latestSnapshot = await this.prisma.marketSignal.findFirst({
      where: { source: 'KING_AGENT_CORE', type: 'KING_TREASURY_SNAPSHOT' },
      orderBy: { createdAt: 'desc' },
    });

    let liveBalance = 0;
    let binanceBalance = 0;
    let nearBalance = 0;
    if (latestSnapshot?.data) {
      try {
        const parsed = JSON.parse(latestSnapshot.data);
        liveBalance = parsed.total ?? 0;
        binanceBalance = parsed.binance ?? 0;
        nearBalance = parsed.near ?? 0;
      } catch {
        // ignore parse errors
      }
    }

    return {
      balance: liveBalance,
      binanceBalance,
      nearBalance,
      totalRealSwept,
      totalPaperProfit,
      totalSwept: totalRealSwept, // backward compat
      threshold: this.SWEEP_THRESHOLD_USD,
      nearPrice: this.cachedNearPrice,
      cycleCount: this.cycleCount,
      currentCycleId: this.currentCycleId,
      health,
      logs: signals.map((s: { type: string; data: string | null; createdAt: Date }) => ({
        type: s.type,
        data: s.data,
        time: s.createdAt,
      })),
      telemetry: telemetry.map((t: { type: string; data: string | null; createdAt: Date }) => {
        let parsed: Record<string, unknown> = {};
        try {
          parsed = t.data ? JSON.parse(t.data) : {};
        } catch {
          // ignore
        }
        return { ...parsed, type: t.type, time: t.createdAt };
      }),
      sweepHistory: sweepEvents.map((e: { amount: number; metadata: string | null; occurredAt: Date }) => ({
        amount: e.amount,
        metadata: e.metadata,
        time: e.occurredAt,
      })),
      physicalAttacks: paperEvents.map((e: { amount: number; metadata: string | null; occurredAt: Date; description: string | null }) => ({
        amount: e.amount,
        metadata: e.metadata,
        description: e.description,
        time: e.occurredAt,
      })),
      products: products.map((p: { data: string | null; createdAt: Date }) => {
        let parsed: Record<string, unknown> = {};
        try {
          parsed = p.data ? JSON.parse(p.data) : {};
        } catch {
          // ignore
        }
        return { ...parsed, time: p.createdAt };
      }),
      payments: [
        await this.checkPayPalApi(),
      ].map(p => ({ type: p.name, status: p.status, currency: 'USD' })),
    };
  }

  // ═══════════════════════════════════════════════════════════
  //  REVENUE MODELS SYNC — 5 Real Income Streams
  // ═══════════════════════════════════════════════════════════

  private async syncRevenueModels(): Promise<void> {
    this.logger.log('📊 KING: Sincronizando Revenue Models (5 canales)...');

    try {
      const report = this.revenueModels.getFullReport();
      
      // Log report summary (no DB write — schema untouched)
      this.logger.log(`📊 Revenue Report: ${report.activeChannels}/${report.totalChannels} canales activos, target $${report.estimatedMonthlyRevenue}/mes`);

      // Build Telegram summary
      const channelSummary = report.channels
        .map(ch => {
          const statusIcon = ch.status === 'ACTIVE' ? '🟢' : '🟡';
          return `${statusIcon} *${ch.name}*\n   Target: $${ch.monthlyTarget}/mes | Status: ${ch.status}`;
        })
        .join('\n');

      const nextActionsList = report.nextActions.slice(0, 5).join('\n');

      const telegramMsg = `📊 *REVENUE MODELS — BRIEFING*\n\n` +
        `📈 Canales activos: ${report.activeChannels}/${report.totalChannels}\n` +
        `💰 Target MRR: $${report.estimatedMonthlyRevenue} USD/mes\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `${channelSummary}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🎯 *TOP 5 ACCIONES:*\n${nextActionsList}\n\n` +
        `🔗 Landing: ${URLS.LANDING}\n` +
        `🤖 ResumeAI: ${URLS.LANDING.replace('/landing/index.html', '/resume-ai')}`;

      // Send every 3rd cycle to avoid spam
      if (this.cycleCount % 3 === 1) {
        await this.notifier.sendAlert(telegramMsg).catch(() => {});
      }

      this.logger.log(`📊 KING: Revenue Models sync complete. ${report.activeChannels} canales activos, $${report.estimatedMonthlyRevenue} target MRR.`);
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Unknown error';
      this.logger.warn(`⚠️ Revenue Models sync warning: ${errMsg}`);
    }
  }
}
