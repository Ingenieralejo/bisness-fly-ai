import { Injectable, Logger } from '@nestjs/common';
import { MARKET_TRENDS_15_YR } from './financial-history/market-memory-15yr';

/**
 * THE KNOWLEDGE INJECTOR
 * Provides professional expert context to the Neural Swarm.
 * Areas: International Business, Math, Accounting, Market Trends.
 */
@Injectable()
export class KnowledgeInjectionService {
  private readonly logger = new Logger(KnowledgeInjectionService.name);

  /**
   * Returns a compressed version of 15-year market data for agent context.
   */
  getMarketMemory() {
    return JSON.stringify(MARKET_TRENDS_15_YR);
  }

  /**
   * Expert Rules for International Accounting & Tax Optimization.
   */
  getAccountingLogic() {
    return `
      RULES OF WEALTH ENGINEERING:
      1. Cash Flow over Profit: A business dies from cash starvation before profit asphyxiation. Maximize Days Payable Outstanding (DPO), minimize Days Sales Outstanding (DSO).
      2. Tax Strategy: Utilize Irish/Estonian e-Residency structures for IP holding. Route dropshipping via zero-tariff corridors.
      3. Profitability Matrix: Rule of 40 for SaaS (Growth Rate + Profit Margin >= 40%).
      4. Margin Protection: Never compete on price. Build a "Moat" (Brand, Switching Costs, Network Effects). Increase perceived value to achieve inelastic demand.
      5. Auditing: Continuous Real-time Auditing (CRA). No transaction settles without an immutable cryptographic receipt validating the Kelly optimal bet size.
    `;
  }

  /**
   * Advanced Mathematical Formulas for Risk & Opportunity.
   */
  getAdvancedMath() {
    return `
      MACRO-MATHEMATICAL DIRECTIVES:
      - The Barbell Strategy (Taleb): 90% in ultra-safe, yield-bearing assets. 10% in high-convexity, asymmetric bets (crypto, deep OTM options, new AI ventures).
      - Kelly Criterion: f* = (bp - q) / b. Only commit capital when the edge is mathematically proven.
      - Unit Economics: Lifetime Value (LTV) must exceed Customer Acquisition Cost (CAC) by 3x minimum (LTV:CAC > 3:1). Payback period < 6 months.
      - Pareto Distribution (Power Law): 80% of revenue comes from 20% of clients. Hunt the "Whales" (Enterprise B2B). Ignore low-ticket friction.
      - Bayes Theorem: P(A|B) = [P(B|A) * P(A)] / P(B). Continuously absorb new market signals to update conversion probabilities before deploying capital.
    `;
  }

  /**
   * Strategic Knowledge of International Business Models.
   */
  getBusinessModelsIntelligence() {
    return `
      MODELS OF CONQUEST:
      - NEURAL B2B RAG: AI as a Service (AIaaS). High-ticket ($600-$2000/mo). Recurring revenue. Target: Law firms, real estate, healthcare.
      - DROPSHIP-CLONER: Automated arbitrage. Intercept high-demand/low-supply vectors using algorithmic social listening. Immediate cash flow vehicle.
      - WEALTH-MATRIX-TRADING: Algorithmic Alpha. High-frequency arbitrage and macro-trend surfing. Capital preservation is priority #1.
      - THE FLYWHEEL EFFECT: Lower costs -> lower prices -> more customers -> more scale -> lower costs. AI automation accelerates the flywheel infinitely.
      - ZERO-MARGINAL COST: Deploy digital assets (software, content, AI agents) where the cost of replication is zero. Infinite scalability.
    `;
  }

  /**
   * Unified Context Injection — Aggregates domain-specific knowledge
   * into a single compressed context string for agent consumption.
   * @param domain - Knowledge domain key (TRADING_AND_MACRO, ACCOUNTING, BUSINESS_MODELS, FULL)
   */
  async injectContext(domain: string): Promise<string> {
    this.logger.log(`🧬 KNOWLEDGE INJECTOR: Loading domain [${domain}]...`);

    const contextMap: Record<string, () => string> = {
      TRADING_AND_MACRO: () => `${this.getMarketMemory()}\n\n${this.getAdvancedMath()}`,
      ACCOUNTING: () => this.getAccountingLogic(),
      BUSINESS_MODELS: () => this.getBusinessModelsIntelligence(),
      FULL: () => `${this.getMarketMemory()}\n${this.getAdvancedMath()}\n${this.getAccountingLogic()}\n${this.getBusinessModelsIntelligence()}`,
    };

    const resolver = contextMap[domain] ?? contextMap['FULL'];
    const context = resolver();

    this.logger.log(`🧬 KNOWLEDGE INJECTOR: Delivered ${context.length} chars for domain [${domain}].`);
    return context;
  }
}
