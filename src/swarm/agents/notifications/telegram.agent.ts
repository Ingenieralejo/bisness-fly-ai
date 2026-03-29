import { Injectable, Logger } from '@nestjs/common';

/**
 * AGENT: TELEGRAM NOTIFIER
 * Direct neural notification bridge to the Meta-Architect.
 */
@Injectable()
export class TelegramAgent {
  private readonly logger = new Logger(TelegramAgent.name);
  private readonly token = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.ADMIN_USER_ID;

  async sendAlert(text: string) {
    if (!this.token || !this.chatId) {
      this.logger.warn('⚠️ TELEGRAM_BOT_TOKEN or ADMIN_USER_ID missing. Alert logged but not sent.');
      this.logger.log(`[ALERT]: ${text}`);
      return;
    }

    try {
      const axios = await import('axios');
      const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
      await axios.default.post(url, {
        chat_id: this.chatId,
        text: `⚡ *FLY.AI NEURAL ALERT* ⚡\n\n${text}`,
        parse_mode: 'Markdown',
      });
      this.logger.log('📢 Telegram notification sent to Architect.');
    } catch (e: any) {
      const msg = e.response?.data?.description || e.message;
      this.logger.error(`❌ Telegram delivery failed: ${msg}`);
    }
  }
}
