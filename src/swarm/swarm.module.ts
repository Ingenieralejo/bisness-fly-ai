import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SwarmController } from './swarm.controller';
import { SwarmOrchestrator } from './orchestrator.service';

// Strategic Services (Engines)
import { OpportunityScorerService } from '../engines/opportunity-scorer.service';
import { PipelineManagerService } from '../engines/pipeline-manager.service';
import { RevenueDashboardService } from '../engines/revenue-dashboard.service';
import { TrendAnalyzerService } from '../engines/trend-analyzer.service';
import { OutreachEngineService } from '../engines/outreach-engine.service';
import { ModuleRoiService } from '../engines/module-roi.service';
import { DecisionEngineService } from '../engines/decision-engine.service';
import { LocalModelService } from '../llm/local-model.service';
import { KnowledgeInjectionService } from '../knowledge/knowledge-injection.service';

// Ops Agents (Execution Layer)
import { MarketScannerAgent } from './agents/market-scanner.agent';
import { LeadHunterAgent } from './agents/lead-hunter.agent';
import { RevenueTrackerAgent } from './agents/revenue-tracker.agent';
import { TradingAgent } from './agents/trading/trading.agent';
import { DropshipAgent } from './agents/dropship/dropship.agent';
import { BusinessClonerAgent } from './agents/clusters/cloner.agent';
import { PaymentsAgent } from './agents/payments/payments.agent';
import { TelegramAgent } from './agents/notifications/telegram.agent';
import { RevenueSniperAgent } from './agents/revenue-sniper.agent';
import { KingAgent } from './agents/king.agent';

@Module({
  imports: [PrismaModule],
  controllers: [SwarmController],
  providers: [
    SwarmOrchestrator,
    // Strategic Services
    OpportunityScorerService,
    PipelineManagerService,
    RevenueDashboardService,
    TrendAnalyzerService,
    OutreachEngineService,
    ModuleRoiService,
    DecisionEngineService,
    LocalModelService,
    KnowledgeInjectionService,
    // Ops Agents
    MarketScannerAgent,
    LeadHunterAgent,
    RevenueTrackerAgent,
    TradingAgent,
    DropshipAgent,
    BusinessClonerAgent,
    PaymentsAgent,
    TelegramAgent,
    RevenueSniperAgent,
    KingAgent,
  ],
  exports: [
    SwarmOrchestrator,
    RevenueDashboardService,
    PipelineManagerService,
    TradingAgent,
    DropshipAgent,
    BusinessClonerAgent,
    PaymentsAgent,
    TelegramAgent,
    RevenueSniperAgent,
    KingAgent,
  ],
})
export class NeuralSwarmModule {}
