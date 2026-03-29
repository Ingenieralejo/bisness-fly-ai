import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TelegramAgent } from './notifications/telegram.agent';
import { LocalModelService } from '../../llm/local-model.service';

/**
 * AGENT: REVENUE SNIPER
 * Focus: Immediate $100+ revenue extraction.
 * Methods: Micro-Gig Bidding, Affiliate Arbitrage, Survey Spoofing (Conceptual).
 */
@Injectable()
export class RevenueSniperAgent {
  private readonly logger = new Logger(RevenueSniperAgent.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: TelegramAgent,
    private readonly localModel: LocalModelService
  ) {}

  /**
   * Sniper Cycle: Identify the fastest path to $100
   */
  async runSniperCycle() {
    this.logger.log('🎯 REVENUE SNIPER: Hunting for quick $100 extraction...');

    // Method 1: B2B Quick Win (AI-Audit Outreach)
    await this.huntMicroGigs();

    // Method 2: Survey / Bounty Scan
    await this.scanForBounties();

    this.logger.log('✅ REVENUE SNIPER: Cycle complete.');
  }

  private async huntMicroGigs() {
    this.logger.log('🔍 SNIPER: Scanning for B2B Micro-Gigs ($100 - $300)...');
    
    const targets = [
      { name: 'Legal Consultant X', problem: 'Broken PDF processing', budget: 150 },
      { name: 'Dr. Dental Office Y', problem: 'Manual appointment booking', budget: 200 },
      { name: 'Local E-shop Z', problem: 'Bad product descriptions', budget: 100 }
    ];

    for (const target of targets) {
       this.logger.log(`🎯 Targeting: ${target.name} for $${target.budget} solution...`);
       
       const prompt = `Create a 2-sentence ultra-aggressive value proposition for "${target.name}" who has "${target.problem}". 
Offer a fixed-price $${target.budget} implementation of an AI agent that fixes this tonight. 
Tone: Professional, elite, non-negotiable. Language: Spanish.`;
       
       const msg = await this.localModel.executeReasoning(prompt, 'You are an elite close-proximity sales sniper.');
       
       await this.notifier.sendAlert(`🎯 *REVENUE SNIPER TARGET DETECTED* \n\nEmpresa: *${target.name}* \nPresupuesto: *$${target.budget}* \nProblema: ${target.problem} \n\n*Pitch Propuesto:* \n${msg}`);
    }
  }

  private async scanForBounties() {
    this.logger.log('🕵️ SNIPER: Searching for AI coding bounties and grants...');
    
    const bounty = {
        title: "AI Integration Survey Bounty",
        amount: 50,
        source: "Innocentive / Freelancer",
        link: "https://www.freelancer.com/jobs/ai-integration-survey"
    };

    this.logger.log(`💎 Bounty Found: ${bounty.title} ($${bounty.amount})`);
    await this.notifier.sendAlert(`💎 *BOUNTY DETECTADA ($${bounty.amount})* \n\n*${bounty.title}* \nFuente: ${bounty.source} \n\nEl sistema está listo para automatizar el ingreso si das la orden.`);
  }

  /**
   * Launch a $100 "AI Starter Pack" campaign (Direct to WhatsApp)
   */
  async launchDigitalProductCampaign() {
    this.logger.log('🚀 SNIPER: Launching $100 AI Starter Pack campaign...');
    
    // 1. Identify 5 leads from market scans that have LOW AI automation scores
    const opportunities = await this.prisma.marketOpportunity.findMany({
      where: { demandScore: { lt: 50 } },
      take: 5
    });

    for (const opp of opportunities) {
       const payLink = `https://buy.stripe.com/test_6oEh0X6jC492`; // Mock Test Link
       const pitch = `¡Hola! Noté que tu negocio en el sector ${opp.sector} no está usando IA. He preparado un "AI Starter Pack" por solo $100 USD que automatiza tus correos y redes. ¿Te interesa ver el enlace?`;
       
       await this.notifier.sendAlert(`🚀 *CAMPANA SNIPER ACTIVA ($100)* \n\nOportunidad: *${opp.title}* \n\n*Mensaje para enviar:* \n${pitch} \n\nEnlace de Pago: ${payLink}`);
    }
  }
}
