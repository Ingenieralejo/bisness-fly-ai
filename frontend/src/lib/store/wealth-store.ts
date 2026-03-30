import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BizModel {
  id: string;
  slug: string;
  name: string;
  category: "B2B" | "B2C" | "TRADING" | "DIGITAL" | "FINANCIAL";
  status: "ACTIVE" | "HUNTING" | "SCALING";
  revenue: number;
  potential: number;
  icon: string;
  description: string;
  payout: "BANCOLOMBIA" | "BINANCE" | "STRIPE" | "PAYPAL";
}

interface WealthState {
  portfolio: BizModel[];
  globalRevenue: number;
  activeLeads: number;
  isSyncing: boolean;
  setPortfolio: (portfolio: BizModel[]) => void;
  updateBiz: (id: string, updates: Partial<BizModel>) => void;
  setGlobalRevenue: (rev: number) => void;
  setSyncing: (syncing: boolean) => void;
}

export const useWealthStore = create<WealthState>()(
  persist(
    (set) => ({
      portfolio: [
        { id: '1', name: 'Legal RAG B2B', slug: 'legal-rag', category: 'B2B', status: 'ACTIVE', revenue: 0, potential: 15000, icon: '🏛️', description: 'AI Nodes for Law Firms (SaaS)', payout: 'STRIPE' },
        { id: '2', name: 'Binance Arbitrage', slug: 'binance-bot', category: 'TRADING', status: 'ACTIVE', revenue: 0, potential: 5000, icon: '📈', description: 'Cross-Exchange Crypto Scalping', payout: 'BINANCE' },
        { id: '3', name: 'Global Dropshipping', slug: 'dropshipping', category: 'B2C', status: 'HUNTING', revenue: 0, potential: 12000, icon: '🛒', description: 'Product Sourcing & Shopify Bot', payout: 'PAYPAL' },
        { id: '4', name: 'Fiverr IA Clones', slug: 'fiverr-clones', category: 'DIGITAL', status: 'ACTIVE', revenue: 0, potential: 4000, icon: '⚡', description: 'Auto-Task Micro-Services', payout: 'PAYPAL' },
        { id: '5', name: 'Real Estate Leads', slug: 'real-estate', category: 'B2B', status: 'HUNTING', revenue: 0, potential: 20000, icon: '🏡', description: 'High-Ticket Property AI Filter', payout: 'STRIPE' },
        { id: '6', name: 'SaaS Cloner Hub', slug: 'saas-cloner', category: 'DIGITAL', status: 'SCALING', revenue: 0, potential: 8000, icon: '🧬', description: 'Fast Micro-App Deployment', payout: 'STRIPE' },
        { id: '7', name: 'Affiliate Scaling', slug: 'affiliate', category: 'FINANCIAL', status: 'HUNTING', revenue: 0, potential: 10000, icon: '🔗', description: 'Enterprise Software Distribution', payout: 'BANCOLOMBIA' },
        { id: '8', name: 'B2B Lead Scraping', slug: 'b2b-leads', category: 'B2B', status: 'ACTIVE', revenue: 0, potential: 6000, icon: '🛰️', description: 'Verified Corporate Data Mining', payout: 'STRIPE' },
        { id: '9', name: 'Social Media Bot', slug: 'social-bot', category: 'DIGITAL', status: 'SCALING', revenue: 0, potential: 3000, icon: '📱', description: 'Automated Sales Content Generator', payout: 'PAYPAL' },
        { id: '10', name: 'RAG-as-a-Service', slug: 'raas', category: 'B2B', status: 'ACTIVE', revenue: 0, potential: 25000, icon: '🧠', description: 'Industrial Intelligence Subscription', payout: 'BANCOLOMBIA' },
        { id: '11', name: 'KING Autonomous AI', slug: 'king', category: 'TRADING', status: 'ACTIVE', revenue: 105.50, potential: 250000, icon: '👑', description: 'Zero-Human Digital Products (AgentKit / NEAR)', payout: 'BINANCE' }
      ] as BizModel[],
      globalRevenue: 0,
      activeLeads: 0,
      isSyncing: false,
      setPortfolio: (portfolio) => set({ portfolio }),
      updateBiz: (id, updates) => set((state) => ({
        portfolio: state.portfolio.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      setGlobalRevenue: (globalRevenue) => set({ globalRevenue }),
      setSyncing: (isSyncing) => set({ isSyncing }),
    }),
    { name: 'wealth-matrix-storage' }
  )
);
