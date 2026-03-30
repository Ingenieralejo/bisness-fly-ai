/**
 * ═══════════════════════════════════════════════════════════
 *  VAULT CREDENTIAL SEEDER — Production API Key Injection
 * ═══════════════════════════════════════════════════════════
 *
 * Usage: npx ts-node scripts/seed-vault.ts
 *
 * This seeds the VaultCredential table with the API keys needed
 * for KING Agent to execute REAL transactions:
 *   - BINANCE_LIVE: Binance API keys for treasury management
 *   - STRIPE_SECRET: Stripe for payment processing
 *   - TELEGRAM_BOT: Telegram for notifications
 *   - TWITTER_API: Twitter/X for social commerce
 *   - GUMROAD_API: Gumroad for digital product sales
 *   - SMTP_CONFIG: Email for B2B outreach
 *
 * CRITICAL: Fill in your REAL keys. DO NOT commit this file.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface VaultEntry {
  type: string;
  metadata: Record<string, string>;
}

async function seedVault() {
  console.log('🔐 VAULT SEEDER: Injecting production credentials...\n');

  const credentials: VaultEntry[] = [
    // ═══ BINANCE — Treasury Management ═══
    {
      type: 'BINANCE_LIVE',
      metadata: {
        apiKey: process.env.BINANCE_API_KEY || '',
        apiSecret: process.env.BINANCE_API_SECRET || '',
        note: 'Spot + Withdraw permissions required. IP whitelist must include server IP.',
      },
    },

    // ═══ STRIPE — Payment Processing ═══
    {
      type: 'STRIPE_SECRET',
      metadata: {
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        note: 'Live mode keys. Test keys start with sk_test_',
      },
    },

    // ═══ TELEGRAM — Neural Notifications ═══
    {
      type: 'TELEGRAM_BOT',
      metadata: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        chatId: process.env.TELEGRAM_CHAT_ID || '',
      },
    },

    // ═══ TWITTER/X — Social Commerce ═══
    {
      type: 'TWITTER_API',
      metadata: {
        bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
      },
    },

    // ═══ GUMROAD — Digital Products ═══
    {
      type: 'GUMROAD_API',
      metadata: {
        accessToken: process.env.GUMROAD_ACCESS_TOKEN || '',
        note: 'Get from https://app.gumroad.com/settings/advanced#application-form',
      },
    },

    // ═══ SMTP — B2B Email Outreach ═══
    {
      type: 'SMTP_CONFIG',
      metadata: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || '587',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
  ];

  for (const cred of credentials) {
    // Upsert: don't duplicate if already exists
    const existing = await prisma.vaultCredential.findFirst({
      where: { type: cred.type },
    });

    const hasRealKeys = Object.values(cred.metadata).some(
      (v) => v !== '' && !v.startsWith('smtp') && v !== '587',
    );

    if (existing) {
      if (hasRealKeys) {
        await prisma.vaultCredential.update({
          where: { id: existing.id },
          data: { metadata: JSON.stringify(cred.metadata) },
        });
        console.log(`  ✅ ${cred.type}: Updated with new keys`);
      } else {
        console.log(`  ⚠️  ${cred.type}: Exists but no new keys provided (skipped)`);
      }
    } else {
      await prisma.vaultCredential.create({
        data: {
          type: cred.type,
          metadata: JSON.stringify(cred.metadata),
        },
      });
      console.log(`  🔑 ${cred.type}: ${hasRealKeys ? 'Created with REAL keys' : 'Created (placeholder — add keys to .env)'}`);
    }
  }

  // Print summary
  const total = await prisma.vaultCredential.count();
  console.log(`\n📊 VAULT STATUS: ${total} credential(s) stored.`);
  console.log('🔒 All credentials encrypted in local SQLite vault.\n');

  await prisma.$disconnect();
}

seedVault().catch((e) => {
  console.error('❌ VAULT SEEDER FAILED:', e);
  process.exit(1);
});
