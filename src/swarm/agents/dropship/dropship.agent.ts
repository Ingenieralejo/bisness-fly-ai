import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

interface ProductCandidate {
  name: string;
  niche: string;
  estimatedMargin: number;
  demandScore: number;
  source: string;
}

import { LocalModelService } from '../../../llm/local-model.service';

/**
 * AGENT: DROPSHIP
 * Identifies high-margin dropshipping products and automates store setup research.
 */
@Injectable()
export class DropshipAgent {
  private readonly logger = new Logger(DropshipAgent.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly localModel: LocalModelService
  ) {}

  /**
   * Hunt for winning product candidates via REAL API integration
   */
  async huntProducts(): Promise<ProductCandidate[]> {
    this.logger.log('🛒 DROPSHIP AGENT: Scanning global marketplace for real trending products...');

    // Niche queries for real product searching
    const targetNiches = ['smart home', 'fitness tracker', 'wireless charger', 'ergonomic tech'];
    const candidates: ProductCandidate[] = [];

    // Import axios dynamically to avoid top-level issues if not needed elsewhere
    const axios = require('axios');

    for (const niche of targetNiches) {
      try {
        // Query MercadoLibre's open API for real data
        const response = await axios.get(`https://api.mercadolibre.com/sites/MCO/search?q=${encodeURIComponent(niche)}&limit=5`);
        const results = response.data.results;

        for (const item of results) {
          // Calculate an estimated profit margin assuming a 40% markup structure
          const price = item.price;
          const estimatedMargin = price * 0.40;
          const demandScore = item.sold_quantity > 0 ? Math.min(100, item.sold_quantity) : 60;

          if (demandScore >= 50 && estimatedMargin > 0) {
            candidates.push({
              name: item.title,
              niche: niche,
              estimatedMargin: estimatedMargin,
              demandScore: demandScore,
              source: item.permalink, 
            });
          }
        }
      } catch (error: any) {
        this.logger.error(`Failed to scan niche ${niche}: ${error.message}`);
      }
    }

    const winners = candidates.filter(p => p.demandScore > 55);

    for (const product of winners) {
      await this.prisma.marketOpportunity.create({
        data: {
          title: `[Live Drop] ${product.name}`,
          status: 'DETECTED',
          demandScore: product.demandScore,
          confidence: product.demandScore / 100,
          sector: 'E-Commerce',
          niche: product.niche,
          marginEstimate: product.estimatedMargin,
          trendDirection: 'RISING',
          entryBarrier: 'LOW',
          competitionLevel: 'HIGH',
          metadata: JSON.stringify({ sourceUrl: product.source, createdAt: new Date().toISOString() }),
        },
      });
    }

    this.logger.log(`✅ DROPSHIP AGENT: ${winners.length} real products fully processed & stored.`);
    return winners;
  }

  /**
   * Autonomously generate High-Converting persuasive copy using Local Llama3
   * and simulate store pipeline injection.
   */
  async setupStore(product: ProductCandidate): Promise<{ status: string; storeName: string; adCopy: string }> {
    this.logger.log(`🏪 Generating Neuro-Persuasive Ad Copy for: ${product.name}...`);

    const prompt = `Write a high-converting Facebook Ad copy for the following dropshipping product: "${product.name}". 
    Focus on emotional triggers, urgency, and the problem it solves. Keep it short, punchy, and include a Call to Action. Use Spanish.`;
    
    const context = `You are an elite dropshipping copywriter maximizing ROI. Use emojis strategically.`;
    
    // Leverage the Local LLM Brain
    const generatedCopy = await this.localModel.executeReasoning(prompt, context);
    
    this.logger.log(`✍️ Copy generated: ${generatedCopy.substring(0, 100)}...`);

    const storeName = `flyai-${product.niche.toLowerCase().replace(/\s+/g, '-')}-store`;

    await this.prisma.revenuePipeline.create({
      data: {
        channel: 'DROPSHIP',
        stage: 'PROSPECT',
        dealValue: product.estimatedMargin * 30, // Estimated monthly revenue
        probability: 0.4,
        weightedValue: product.estimatedMargin * 30 * 0.4,
        amount: 0,
        status: 'ACTIVE',
        metadata: JSON.stringify({ product: product.name, storeName, adCopy: generatedCopy, setupAt: new Date().toISOString() }),
      },
    });

    return { status: 'SETUP_PENDING', storeName, adCopy: generatedCopy };
  }
}
