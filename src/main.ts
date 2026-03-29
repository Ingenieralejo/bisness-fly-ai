import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('FLY_AI_BOOTHSTRAP');
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for the Frontend
  app.enableCors();
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  logger.log(`🚀 FLY.AI [WEALTH MATRIX] - Backend is operational on Port: ${port}`);
  logger.log(`🌀 NEURAL SWARM ACTIVE & GLOBAL KNOWLEDGE INJECTED.`);
}
bootstrap();
