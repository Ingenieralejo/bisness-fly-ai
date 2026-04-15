/**
 * ═══════════════════════════════════════════════════════════
 *  BISNESS FLY.AI — CENTRALIZED URL CONSTANTS
 * ═══════════════════════════════════════════════════════════
 *  Single source of truth for all outbound URLs.
 *  Update here → takes effect across all agents.
 */

export const URLS = {
  /** Production landing page (Vercel) */
  LANDING: 'https://frontend-eta-six-26.vercel.app',

  /** Landing page with dynamic amount parameter */
  LANDING_WITH_AMOUNT: (amount: number) =>
    `https://frontend-eta-six-26.vercel.app?amount=${amount}`,

  /** Live demo portfolio */
  DEMO_PORTFOLIO: 'https://frontend-eta-six-26.vercel.app/demo',

  /** Main Next.js app root */
  APP_ROOT: 'https://frontend-eta-six-26.vercel.app',

  /** PayPal.me payment link */
  PAYPAL_BASE: 'https://paypal.me/LuisMonroy76',

  /** PayPal.me with dynamic amount */
  PAYPAL_WITH_AMOUNT: (amount: number) =>
    `https://paypal.me/LuisMonroy76/${amount}`,
} as const;
