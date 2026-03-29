import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * MODULE: PRISMA
 * Global database access for the entire Wealth Matrix.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
