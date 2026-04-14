import { Module } from '@nestjs/common';
import { ProductionController } from './production.controller';
import { PaypalWebhookController } from './paypal-webhook.controller';
import { CRMAPIController } from './crm-api.controller';
import { ProductionService } from './production.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NeuralSwarmModule } from '../swarm/swarm.module';

@Module({
  imports: [PrismaModule, NeuralSwarmModule],
  controllers: [ProductionController, PaypalWebhookController, CRMAPIController],
  providers: [ProductionService],
  exports: [ProductionService],
})
export class ProductionModule {}
