/**
 * THE MARKET MEMORY (15-YEAR HORIZON: 2011-2026)
 * Historical behavior patterns of global indices and FX.
 */
export const MARKET_TRENDS_15_YR = {
  periods: [
    {
      years: "2011-2015",
      regime: "Post-Crisis Expansion",
      drivers: "Low rates, quantitative easing, emerging market growth.",
      keyEvents: "Eurozone Crisis resolution, US Shale boom.",
      avgVolatility: "Moderate",
    },
    {
      years: "2016-2019",
      regime: "Tech Supremacy & Geopolitics",
      drivers: "Cloud computing era, trade wars (US-China), deregulation.",
      keyEvents: "Brexit, Trump Tax Cuts, Bitcoin first peak.",
      avgVolatility: "High Frequency",
    },
    {
      years: "2020-2023",
      regime: "The Great Reset",
      drivers: "Global pandemic, massive stimulus, subsequent inflation spikes.",
      keyEvents: "Supply chain collapse, Web3 peak/burst, AI infrastructure race.",
      avgVolatility: "Extreme",
    },
    {
      years: "2024-2026",
      regime: "Agentic Economy",
      drivers: "Full-scale AI integration into labor, robotic automation, energy pivot.",
      keyEvents: "LLM saturation, sovereign debt challenges, decentralized finance (DeFi) as global norm.",
      avgVolatility: "Adaptive",
    }
  ],
  correlations: {
    "USD/Gold": "Negative (Standard hedge)",
    "EUR/COP": "Export-driven (Commodity influence)",
    "S&P 500/Rates": "Inverted sensitivity (Inflationary risk)",
  }
};
