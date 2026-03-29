import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as nodemailer from 'nodemailer';

interface CampaignTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
}

interface OutreachTarget {
  email: string;
  name: string;
  company: string;
  sector: string;
}

@Injectable()
export class OutreachEngineService {
  private readonly logger = new Logger(OutreachEngineService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly prisma: PrismaService) {}

  /** Initialize email transporter (configure with your SMTP credentials) */
  private getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      });
    }
    return this.transporter;
  }

  /** Create a new outreach campaign */
  async createCampaign(data: {
    name: string;
    channel: string;
    targetSegment: string;
    totalTargets: number;
    schedule?: string;
  }) {
    const campaign = await this.prisma.outreachCampaign.create({
      data: {
        title: data.name,
        name: data.name,
        channel: data.channel,
        targetSegment: data.targetSegment,
        totalTargets: data.totalTargets,
        schedule: data.schedule,
        status: 'DRAFT',
      },
    });

    this.logger.log(`📧 Campaign created: ${campaign.title} (${data.channel})`);
    return campaign;
  }

  /** Get all campaigns with stats */
  async getCampaigns(status?: string) {
    const where = status ? { status } : {};
    return this.prisma.outreachCampaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Generate B2B cold email template for AI services */
  generateB2BTemplate(target: OutreachTarget): CampaignTemplate {
    const subject = `${target.company}: Su competencia ya usa IA — ¿y ustedes?`;

    const htmlBody = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <p>Estimado/a <strong>${target.name}</strong>,</p>

  <p>Le escribo porque identificamos que <strong>${target.company}</strong> en el sector <strong>${target.sector}</strong>
  podría beneficiarse enormemente de la automatización con Inteligencia Artificial.</p>

  <h3 style="color: #6366f1;">¿Qué ofrecemos?</h3>
  <ul>
    <li>🤖 <strong>Chatbot de WhatsApp con IA</strong> — Atiende consultas 24/7 y agenda citas automáticamente</li>
    <li>📄 <strong>Asistente Legal Inteligente (RAG)</strong> — Búsqueda instantánea en documentos legales</li>
    <li>📊 <strong>Automatización de procesos</strong> — Reduce costos operativos hasta un 60%</li>
  </ul>

  <p><strong>Resultados para clientes similares:</strong></p>
  <ul>
    <li>✅ 40% menos tiempo en consultas repetitivas</li>
    <li>✅ 3x más clientes atendidos por hora</li>
    <li>✅ ROI positivo en menos de 30 días</li>
  </ul>

  <p>¿Le gustaría una <strong>demostración gratuita de 15 minutos</strong> adaptada a ${target.company}?</p>

  <p>Quedo atento a su respuesta.</p>

  <p style="margin-top: 30px;">
    <strong>Alejandro Monroy</strong><br/>
    CEO, Fly.AI — Automatización Inteligente<br/>
    🌐 fly-ai.co | 📱 WhatsApp: +57 ${process.env.ADMIN_PHONE_NUMBER || '321 436 6769'}
  </p>
</div>`;

    const textBody = `Estimado/a ${target.name},

Le escribo porque identificamos que ${target.company} en el sector ${target.sector} podría beneficiarse enormemente de la automatización con Inteligencia Artificial.

¿Qué ofrecemos?
- Chatbot de WhatsApp con IA — Atiende consultas 24/7
- Asistente Legal Inteligente (RAG) — Búsqueda instantánea en documentos
- Automatización de procesos — Reduce costos operativos hasta un 60%

¿Le gustaría una demostración gratuita de 15 minutos?

Alejandro Monroy
CEO, Fly.AI — Automatización Inteligente
LinkedIn: linkedin.com/in/alejandro-monroy
WhatsApp: +57 ${process.env.ADMIN_PHONE_NUMBER || '321 436 6769'}`;

    return { subject, htmlBody, textBody };
  }

  /** Send a custom AI-generated cold email */
  async sendCustomEmail(target: { email: string; company: string }, subject: string, body: string): Promise<boolean> {
    this.logger.log(`✉️ Sending CUSTOM Neural Outreach to: ${target.email} (${target.company})`);

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: `"Fly.AI - Alejandro Monroy" <${process.env.SMTP_USER || 'hello@fly-ai.co'}>`,
        to: target.email,
        subject: subject,
        text: body, // AI generated text
      });

      this.logger.log(`✅ Custom AI-Email sent to ${target.email}`);
      return true;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to send custom email to ${target.email}: ${errMsg}`);
      return false;
    }
  }

  /** Send a single outreach email using standard template */
  async sendEmail(target: OutreachTarget, campaignId: string): Promise<boolean> {
    const template = this.generateB2BTemplate(target);

    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({
        from: `"Fly.AI" <${process.env.SMTP_USER || 'hello@fly-ai.co'}>`,
        to: target.email,
        subject: template.subject,
        html: template.htmlBody,
        text: template.textBody,
      });

      // Update campaign stats
      await this.prisma.outreachCampaign.update({
        where: { id: campaignId },
        data: { sent: { increment: 1 } },
      });

      this.logger.log(`✉️ Email sent to ${target.email} (${target.company})`);
      return true;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`❌ Failed to send email to ${target.email}: ${errMsg}`);
      return false;
    }
  }

  /** Execute a batch outreach campaign */
  async executeCampaign(campaignId: string, targets: OutreachTarget[]): Promise<{
    sent: number;
    failed: number;
    total: number;
  }> {
    // Update campaign status
    await this.prisma.outreachCampaign.update({
      where: { id: campaignId },
      data: { status: 'ACTIVE', totalTargets: targets.length },
    });

    let sent = 0;
    let failed = 0;

    for (const target of targets) {
      const success = await this.sendEmail(target, campaignId);
      if (success) {
        sent++;
      } else {
        failed++;
      }
      // Throttle: 3 seconds between emails to avoid spam flags
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Update campaign completion
    await this.prisma.outreachCampaign.update({
      where: { id: campaignId },
      data: {
        status: sent > 0 ? 'COMPLETED' : 'DRAFT',
      },
    });

    this.logger.log(`📊 Campaign ${campaignId} complete: ${sent} sent, ${failed} failed`);
    return { sent, failed, total: targets.length };
  }

  /** Get campaign analytics */
  async getCampaignStats() {
    const campaigns = await this.prisma.outreachCampaign.findMany();

    const stats = {
      totalCampaigns: campaigns.length,
      totalSent: campaigns.reduce((sum, c) => sum + c.sent, 0),
      totalOpened: campaigns.reduce((sum, c) => sum + c.opened, 0),
      totalReplied: campaigns.reduce((sum, c) => sum + c.replied, 0),
      totalConverted: campaigns.reduce((sum, c) => sum + c.converted, 0),
      openRate: 0,
      replyRate: 0,
      conversionRate: 0,
    };

    if (stats.totalSent > 0) {
      stats.openRate = (stats.totalOpened / stats.totalSent) * 100;
      stats.replyRate = (stats.totalReplied / stats.totalSent) * 100;
      stats.conversionRate = (stats.totalConverted / stats.totalSent) * 100;
    }

    return stats;
  }
}
