import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TelegramAgent } from '../swarm/agents/notifications/telegram.agent';

@Injectable()
export class ProductionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramAgent,
  ) {}

  async createProject(dto: CreateProjectDto) {
    const project = await this.prisma.$transaction(async (tx) => {
      // Increment global project counter
      const counter = await tx.globalCounter.upsert({
        where: { id: 'PRODUCTION' },
        create: { id: 'PRODUCTION', projects: 1 },
        update: { projects: { increment: 1 } },
      });

      const consecutive = counter.projects;

      return await tx.productionProject.create({
        data: {
          consecutive,
          title: dto.title,
          description: dto.description,
          clientName: dto.clientName,
          clientEmail: dto.clientEmail,
          totalBudget: dto.totalBudget || 0,
          currency: dto.currency || 'USD',
          priority: dto.priority || 'MEDIUM',
          metadata: JSON.stringify(dto.metadata || {}),
        },
      });
    });

    // Notify the Meta-Architect via Telegram
    await this.telegram.sendAlert(
      `🚀 *NUEVA SOLICITUD DE ARQUITECTURA*\n\n` +
      `*Cliente:* ${dto.clientName || 'Anónimo'}\n` +
      `*ID:* PROJ-${(project as any).consecutive}\n` +
      `*Email:* ${dto.clientEmail || 'No provisto'}\n` +
      `*Descripción:* ${dto.description.substring(0, 300)}${dto.description.length > 300 ? '...' : ''}\n\n` +
      `⚡ _FLY.AI Production Engine Active_`
    );

    return project;
  }

  async createTask(dto: CreateTaskDto) {
    return await this.prisma.$transaction(async (tx) => {
      // Verify project exists
      const project = await tx.productionProject.findUnique({
        where: { id: dto.projectId },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
      }

      // Increment global task counter
      const counter = await tx.globalCounter.upsert({
        where: { id: 'PRODUCTION' },
        create: { id: 'PRODUCTION', tasks: 1 },
        update: { tasks: { increment: 1 } },
      });

      const consecutive = counter.tasks;

      return await tx.productionTask.create({
        data: {
          projectId: dto.projectId,
          consecutive,
          title: dto.title,
          description: dto.description,
          assignedTo: dto.assignedTo,
          estimatedCost: dto.estimatedCost || 0,
          currency: dto.currency || 'USD',
          metadata: JSON.stringify(dto.metadata || {}),
        },
      });
    });
  }

  async getProjects() {
    return await this.prisma.productionProject.findMany({
      include: { tasks: true },
      orderBy: { consecutive: 'desc' },
      where: { deletedAt: null },
    });
  }

  async getProject(id: string) {
    const project = await this.prisma.productionProject.findUnique({
      where: { id },
      include: { tasks: true },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async updateProject(id: string, dto: UpdateProjectDto) {
    return await this.prisma.productionProject.update({
      where: { id },
      data: {
        ...dto,
        metadata: dto.metadata ? JSON.stringify(dto.metadata) : undefined,
      },
    });
  }

  async updateTask(id: string, dto: UpdateTaskDto) {
    return await this.prisma.productionTask.update({
      where: { id },
      data: {
        ...dto,
        metadata: dto.metadata ? JSON.stringify(dto.metadata) : undefined,
      },
    });
  }
}
