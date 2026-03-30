import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NeuralSwarmModule } from './swarm/swarm.module';
import { KnowledgeInjectionService } from './knowledge/knowledge-injection.service';
import { PrismaModule } from './prisma/prisma.module';
import { LocalModelService } from './llm/local-model.service';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './shared/auth/jwt-auth.guard';

import { AuthController } from './shared/auth/auth.controller';

/**
 * MODULE: APP (ROOT)
 * The global coordinator for the Wealth Matrix ecosystem.
 */
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'fallback-secret',
      signOptions: { expiresIn: '15m' },
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
    NeuralSwarmModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    KnowledgeInjectionService,
    LocalModelService,
  ],
})
export class AppModule {}
