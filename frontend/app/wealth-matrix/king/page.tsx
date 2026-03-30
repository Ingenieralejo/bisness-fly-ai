"use client";

import "./king.css";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Shield,
  Wallet,
  Cpu,
  Globe2,
  TrendingUp,
  Package,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Crown,
  BarChart3,
  Sparkles,
  Heart,
  XCircle,
  RefreshCw,
  DollarSign,
  ServerCrash,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  Type Definitions
// ─────────────────────────────────────────────────────────────

interface IntegrationHealth {
  name: string;
  status: "CONNECTED" | "MISSING_KEYS" | "UNREACHABLE";
  detail: string;
}

interface KingHealthReport {
  ollama: IntegrationHealth;
  binance: IntegrationHealth;
  near: IntegrationHealth;
  telegram: IntegrationHealth;
  twitter: IntegrationHealth;
  gumroad: IntegrationHealth;
  overallScore: number;
  checkedAt: string;
}

interface TelemetryEntry {
  type: string;
  phase: string;
  status: "RUNNING" | "SUCCESS" | "FAILED";
  detail: string;
  cycleId: string;
  time: string;
}

interface LogEntry {
  id: string;
  time: string;
  msg: string;
  type: string;
}

interface SweepEntry {
  amount: number;
  metadata: string;
  time: string;
}

interface PaperTradeEntry {
  amount: number;
  metadata: string;
  time: string;
}

interface ProductEntry {
  title: string;
  description: string;
  price: number;
  category: string;
  time: string;
}

interface KingStatusResponse {
  balance: number;
  binanceBalance: number;
  nearBalance: number;
  totalRealSwept: number;
  totalPaperProfit: number;
  totalSwept: number;
  threshold: number;
  nearPrice: number;
  cycleCount: number;
  currentCycleId: string;
  health: KingHealthReport;
  logs: { type: string; data: string; time: string }[];
  telemetry: TelemetryEntry[];
  sweepHistory: SweepEntry[];
  paperTrades: PaperTradeEntry[];
  products: ProductEntry[];
}

// ─────────────────────────────────────────────────────────────
//  Dashboard Component
// ─────────────────────────────────────────────────────────────

export default function KingAgentDashboard() {
  const [data, setData] = useState<KingStatusResponse | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);
  const [lastSync, setLastSync] = useState<string>("");
  const [activeTab, setActiveTab] = useState<
    "telemetry" | "logs" | "sweeps" | "paper"
  >("telemetry");
  const [isForcing, setIsForcing] = useState(false);

  const SWEEP_THRESHOLD = 100.0;

  const fetchRealStatus = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/wealth-matrix/king/status");
      if (res.ok) {
        const json: KingStatusResponse = await res.json();
        setData(json);

        if (json.logs && Array.isArray(json.logs)) {
          const formattedLogs: LogEntry[] = json.logs.map(
            (L: { type: string; data: string; time: string }, i: number) => ({
              id: `${L.time}-${i}`,
              time: new Date(L.time).toLocaleTimeString("es-CO"),
              msg: L.data,
              type: L.type.includes("THESIS") ? "social" : "system",
            })
          );
          setLogs(formattedLogs);
        }
        setLastSync(new Date().toLocaleTimeString("es-CO"));
      }
    } catch {
      // Matrix disconnected — silent resilience
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchRealStatus();
    const interval = setInterval(fetchRealStatus, 12000);
    return () => clearInterval(interval);
  }, [fetchRealStatus]);

  const handleForceCommerce = async () => {
    setIsForcing(true);
    await fetch("/api/wealth-matrix/king/launch", {
      method: "POST",
    }).catch(() => {});
    setLogs((prev) => [
      {
        id: Date.now().toString(),
        time: new Date().toLocaleTimeString("es-CO"),
        msg: "⚡ OVERRIDE MANUAL: Ciclo de ejecución forzado...",
        type: "system",
      },
      ...prev,
    ]);
    // Wait a moment then refresh
    setTimeout(async () => {
      await fetchRealStatus();
      setIsForcing(false);
    }, 3000);
  };

  const balance = data?.balance ?? 0;
  const binanceBal = data?.binanceBalance ?? 0;
  const nearBal = data?.nearBalance ?? 0;
  const totalRealSwept = data?.totalRealSwept ?? 0;
  const totalPaperProfit = data?.totalPaperProfit ?? 0;
  const nearPrice = data?.nearPrice ?? 0;
  const cycleCount = data?.cycleCount ?? 0;
  const health = data?.health;
  const overallHealth = health?.overallScore ?? 0;

  return (
    <div className="king-root">
      {/* ═══ ATMOSPHERIC LAYERS ═══ */}
      <div className="atmosphere atmosphere--red" />
      <div className="atmosphere atmosphere--emerald" />
      <div className="atmosphere atmosphere--gold" />
      <div className="noise-overlay" />

      {/* ═══ HEADER ═══ */}
      <header className="king-header">
        <div className="king-header__left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="king-brand"
          >
            <div className="king-brand__icon">
              <Crown size={32} className="king-brand__crown" />
              <div className="king-brand__glow" />
            </div>
            <div>
              <h1 className="king-brand__title">KING AGENT</h1>
              <p className="king-brand__subtitle">
                God Level v3.0 • Hardened Diagnostics • Zero Fake Sweeps
              </p>
            </div>
          </motion.div>
        </div>

        <div className="king-header__right">
          <div className="king-status-pill">
            <div
              className={`king-status-pill__dot ${isSyncing ? "king-status-pill__dot--syncing" : "king-status-pill__dot--live"}`}
            />
            <span className="king-status-pill__text">
              {isSyncing
                ? "Sincronizando APIs..."
                : `Ciclo #${cycleCount} • ${lastSync}`}
            </span>
          </div>
          <button
            className={`king-launch-btn ${isForcing ? "king-launch-btn--forcing" : ""}`}
            id="king-force-commerce"
            onClick={handleForceCommerce}
            disabled={isForcing}
          >
            {isForcing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Zap size={14} />
            )}
            {isForcing ? "EJECUTANDO..." : "FORZAR COMERCIO"}
          </button>
        </div>
      </header>

      {/* ═══ HEALTH DIAGNOSTICS PANEL ═══ */}
      {health && (
        <motion.div
          className="king-health-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="king-health-panel__header">
            <div className="king-health-panel__title-row">
              <Heart size={14} className="text-red" />
              <span>Diagnóstico de Integraciones</span>
            </div>
            <div
              className={`king-health-panel__score king-health-panel__score--${
                overallHealth >= 80
                  ? "good"
                  : overallHealth >= 40
                    ? "warn"
                    : "critical"
              }`}
            >
              {overallHealth}% Operativo
            </div>
          </div>
          <div className="king-health-grid">
            <HealthChip integration={health.ollama} icon={<Cpu size={16} />} />
            <HealthChip
              integration={health.binance}
              icon={<Shield size={16} />}
            />
            <HealthChip
              integration={health.near}
              icon={<Globe2 size={16} />}
            />
            <HealthChip
              integration={health.telegram}
              icon={<Zap size={16} />}
            />
            <HealthChip
              integration={health.twitter}
              icon={<Sparkles size={16} />}
            />
            <HealthChip
              integration={health.gumroad}
              icon={<Package size={16} />}
            />
          </div>
        </motion.div>
      )}

      {/* ═══ METRICS ROW ═══ */}
      <motion.div
        className="king-metrics"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MetricCard
          icon={<Wallet size={18} />}
          label="Balance Vivo"
          value={`$${balance.toFixed(2)}`}
          sub={`Binance: $${binanceBal.toFixed(2)} | NEAR: $${nearBal.toFixed(2)}`}
          color="emerald"
          delay={0.1}
        />
        <MetricCard
          icon={<TrendingUp size={18} />}
          label="Ingresos Reales"
          value={`$${totalRealSwept.toFixed(2)}`}
          sub="Solo transacciones verificadas"
          color="amber"
          delay={0.15}
        />
        <MetricCard
          icon={<DollarSign size={18} />}
          label="Paper Trading P&L"
          value={`$${totalPaperProfit.toFixed(2)}`}
          sub="Kelly Criterion simulado"
          color="indigo"
          delay={0.2}
        />
        <MetricCard
          icon={<Globe2 size={18} />}
          label="NEAR/USD"
          value={nearPrice > 0 ? `$${nearPrice.toFixed(4)}` : "—"}
          sub="CoinGecko Live"
          color="purple"
          delay={0.22}
        />
        <MetricCard
          icon={<BarChart3 size={18} />}
          label="Ciclos Ejecutados"
          value={String(cycleCount)}
          sub="Sin errores fatales"
          color="red"
          delay={0.25}
        />
      </motion.div>

      {/* ═══ MAIN GRID ═══ */}
      <div className="king-grid">
        {/* LEFT: Treasury + Integrations + Products */}
        <div className="king-grid__left">
          {/* Treasury Vault  */}
          <motion.div
            className="king-card king-card--vault"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="king-card__header">
              <Wallet size={14} className="text-emerald" />
              Bóveda Cripto (USDT)
            </h3>
            <div className="king-vault__balance">
              <span className="king-vault__amount">
                ${balance.toFixed(2)}
              </span>
              <span className="king-vault__tag">REAL</span>
            </div>
            <div className="king-vault__breakdown">
              <div className="king-vault__breakdown-item">
                <Shield size={12} className="text-amber" />
                <span>Binance Spot</span>
                <span className="king-vault__breakdown-val">
                  ${binanceBal.toFixed(2)}
                </span>
              </div>
              <div className="king-vault__breakdown-item">
                <Globe2 size={12} className="text-indigo" />
                <span>NEAR On-Chain</span>
                <span className="king-vault__breakdown-val">
                  ${nearBal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Sweep Progress */}
            <div className="king-sweep">
              <div className="king-sweep__labels">
                <span className="king-sweep__label king-sweep__label--left">
                  Umbral de Barrido
                </span>
                <span className="king-sweep__label king-sweep__label--right">
                  Target: ${SWEEP_THRESHOLD.toFixed(2)}
                </span>
              </div>
              <div className="king-sweep__track">
                <motion.div
                  className={`king-sweep__fill ${balance >= SWEEP_THRESHOLD ? "king-sweep__fill--complete" : ""}`}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((balance / SWEEP_THRESHOLD) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              {balance >= SWEEP_THRESHOLD && (
                <motion.p
                  className="king-sweep__alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <ArrowUpRight size={12} />
                  SWEEP AUTOMÁTICO ACTIVO
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Integration Status */}
          <motion.div
            className="king-card king-integrations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="king-integrations__grid">
              <IntegrationChip
                icon={<Globe2 size={20} />}
                name="NEAR"
                status={health?.near?.status ?? "MISSING_KEYS"}
                color="emerald"
              />
              <IntegrationChip
                icon={<Shield size={20} />}
                name="Binance"
                status={health?.binance?.status ?? "MISSING_KEYS"}
                color="amber"
              />
              <IntegrationChip
                icon={<Package size={20} />}
                name="Gumroad"
                status={health?.gumroad?.status ?? "MISSING_KEYS"}
                color="purple"
              />
              <IntegrationChip
                icon={<Sparkles size={20} />}
                name="Twitter/X"
                status={health?.twitter?.status ?? "MISSING_KEYS"}
                color="sky"
              />
            </div>
            <div className="king-integrations__neural">
              <Cpu size={18} className="text-indigo" />
              <span>Ollama LLM (Llama3)</span>
              <span
                className={`king-integrations__active king-integrations__active--${health?.ollama?.status === "CONNECTED" ? "live" : "dead"}`}
              >
                {health?.ollama?.status === "CONNECTED"
                  ? "ACTIVE"
                  : "OFFLINE"}
              </span>
            </div>
          </motion.div>

          {/* Digital Products */}
          {data?.products && data.products.length > 0 && (
            <motion.div
              className="king-card king-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="king-card__header">
                <Package size={14} className="text-purple" />
                Productos Digitales IA
              </h3>
              <div className="king-products__list">
                {data.products.map((p, i) => (
                  <div key={`${p.title}-${i}`} className="king-product-item">
                    <div className="king-product-item__badge">
                      {p.category}
                    </div>
                    <div className="king-product-item__info">
                      <span className="king-product-item__title">
                        {p.title}
                      </span>
                      <span className="king-product-item__desc">
                        {p.description}
                      </span>
                    </div>
                    <span className="king-product-item__price">
                      ${p.price}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT: Terminal + Tabs */}
        <div className="king-grid__right">
          <motion.div
            className="king-card king-terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Terminal Top Bar */}
            <div className="king-terminal__bar">
              <div className="king-terminal__dots">
                <div className="king-terminal__dot king-terminal__dot--red" />
                <div className="king-terminal__dot king-terminal__dot--yellow" />
                <div className="king-terminal__dot king-terminal__dot--green" />
              </div>
              <span className="king-terminal__title">
                GLOBAL MARKET AUDEX: KING_LIVE
              </span>
              <div className="king-terminal__pulse">
                <Activity size={12} className="animate-pulse" />
                <span>En Vivo</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="king-tabs">
              <button
                className={`king-tab ${activeTab === "telemetry" ? "king-tab--active" : ""}`}
                id="king-tab-telemetry"
                onClick={() => setActiveTab("telemetry")}
              >
                <Activity size={12} /> Telemetría
              </button>
              <button
                className={`king-tab ${activeTab === "logs" ? "king-tab--active" : ""}`}
                id="king-tab-logs"
                onClick={() => setActiveTab("logs")}
              >
                <Cpu size={12} /> Tesis IA
              </button>
              <button
                className={`king-tab ${activeTab === "sweeps" ? "king-tab--active" : ""}`}
                id="king-tab-sweeps"
                onClick={() => setActiveTab("sweeps")}
              >
                <TrendingUp size={12} /> Sweeps
              </button>
              <button
                className={`king-tab ${activeTab === "paper" ? "king-tab--active" : ""}`}
                id="king-tab-paper"
                onClick={() => setActiveTab("paper")}
              >
                <BarChart3 size={12} /> Paper P&L
              </button>
            </div>

            {/* Tab Content */}
            <div className="king-terminal__content">
              <AnimatePresence mode="wait">
                {activeTab === "telemetry" && (
                  <motion.div
                    key="telemetry"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="king-terminal__entries"
                  >
                    {data?.telemetry && data.telemetry.length > 0 ? (
                      data.telemetry.map((t, i) => (
                        <TelemetryRow
                          key={`${t.cycleId}-${t.phase}-${i}`}
                          entry={t}
                        />
                      ))
                    ) : (
                      <EmptyState
                        loading={isSyncing}
                        msg="Escaneando blockchain y mercados en vivo..."
                      />
                    )}
                  </motion.div>
                )}

                {activeTab === "logs" && (
                  <motion.div
                    key="logs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="king-terminal__entries"
                  >
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className={`king-log-entry king-log-entry--${log.type}`}
                        >
                          <span className="king-log-entry__time">
                            [{log.time}]
                          </span>
                          <span className="king-log-entry__msg">
                            {typeof log.msg === "string"
                              ? log.msg
                              : JSON.stringify(log.msg)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        loading={isSyncing}
                        msg="Esperando primera tesis magnética..."
                      />
                    )}
                  </motion.div>
                )}

                {activeTab === "sweeps" && (
                  <motion.div
                    key="sweeps"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="king-terminal__entries"
                  >
                    {data?.sweepHistory && data.sweepHistory.length > 0 ? (
                      data.sweepHistory.map((s, i) => (
                        <div key={`sweep-${i}`} className="king-sweep-entry">
                          <div className="king-sweep-entry__icon">
                            <ArrowUpRight size={14} />
                          </div>
                          <div className="king-sweep-entry__detail">
                            <span className="king-sweep-entry__amount">
                              ${s.amount.toFixed(2)} USD
                            </span>
                            <span className="king-sweep-entry__time">
                              {new Date(s.time).toLocaleString("es-CO")}
                            </span>
                          </div>
                          <span className="king-sweep-entry__badge-real">
                            VERIFICADO
                          </span>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        loading={false}
                        msg="Sin sweeps reales ejecutados. Balance debe superar $100 con credenciales activas."
                      />
                    )}
                  </motion.div>
                )}

                {activeTab === "paper" && (
                  <motion.div
                    key="paper"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="king-terminal__entries"
                  >
                    <div className="king-paper-header">
                      <BarChart3 size={14} className="text-indigo" />
                      <span>
                        Paper Trading Total: $
                        {totalPaperProfit.toFixed(2)} USD
                      </span>
                      <span className="king-paper-header__badge">
                        SIMULADO
                      </span>
                    </div>
                    {data?.paperTrades && data.paperTrades.length > 0 ? (
                      data.paperTrades.map((p, i) => (
                        <div
                          key={`paper-${i}`}
                          className="king-paper-entry"
                        >
                          <div className="king-paper-entry__icon">
                            <DollarSign size={14} />
                          </div>
                          <div className="king-paper-entry__detail">
                            <span className="king-paper-entry__amount">
                              +${p.amount.toFixed(2)} USD
                            </span>
                            <span className="king-paper-entry__time">
                              {new Date(p.time).toLocaleString("es-CO")}
                            </span>
                          </div>
                          <span className="king-paper-entry__badge">
                            PAPER
                          </span>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        loading={false}
                        msg="Sin operaciones de arbitraje en papel aún."
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Terminal Prompt */}
            <div className="king-terminal__prompt">
              <span>god_mode_king@fly.ai:~$</span>
              <span className="king-terminal__cursor" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`king-metric king-metric--${color}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className={`king-metric__icon text-${color}`}>{icon}</div>
      <div className="king-metric__body">
        <span className="king-metric__label">{label}</span>
        <span className="king-metric__value">{value}</span>
        <span className="king-metric__sub">{sub}</span>
      </div>
    </motion.div>
  );
}

function IntegrationChip({
  icon,
  name,
  status,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  status: string;
  color: string;
}) {
  const isConnected = status === "CONNECTED";
  return (
    <div
      className={`king-chip king-chip--${color} ${!isConnected ? "king-chip--dim" : ""}`}
    >
      {icon}
      <span className="king-chip__name">{name}</span>
      <span
        className={`king-chip__status ${isConnected ? `text-${color}` : "text-red"}`}
      >
        {isConnected ? "Conectado" : "Sin Claves"}
      </span>
    </div>
  );
}

function HealthChip({
  integration,
  icon,
}: {
  integration: IntegrationHealth;
  icon: React.ReactNode;
}) {
  const statusIcon =
    integration.status === "CONNECTED" ? (
      <CheckCircle2 size={12} className="text-emerald" />
    ) : integration.status === "MISSING_KEYS" ? (
      <AlertTriangle size={12} className="text-amber" />
    ) : (
      <XCircle size={12} className="text-red" />
    );

  return (
    <div
      className={`king-health-chip king-health-chip--${integration.status.toLowerCase()}`}
    >
      <div className="king-health-chip__icon">{icon}</div>
      <div className="king-health-chip__body">
        <div className="king-health-chip__name-row">
          <span className="king-health-chip__name">{integration.name}</span>
          {statusIcon}
        </div>
        <span className="king-health-chip__detail">{integration.detail}</span>
      </div>
    </div>
  );
}

function TelemetryRow({ entry }: { entry: TelemetryEntry }) {
  const statusIcon =
    entry.status === "SUCCESS" ? (
      <CheckCircle2 size={12} className="text-emerald" />
    ) : entry.status === "FAILED" ? (
      <AlertTriangle size={12} className="text-red" />
    ) : (
      <Loader2 size={12} className="text-amber animate-spin" />
    );

  return (
    <div
      className={`king-telemetry-row king-telemetry-row--${entry.status.toLowerCase()}`}
    >
      <div className="king-telemetry-row__icon">{statusIcon}</div>
      <div className="king-telemetry-row__body">
        <div className="king-telemetry-row__header">
          <span className="king-telemetry-row__phase">{entry.phase}</span>
          <span className="king-telemetry-row__time">
            <Clock size={10} />
            {new Date(entry.time).toLocaleTimeString("es-CO")}
          </span>
        </div>
        <p className="king-telemetry-row__detail">{entry.detail}</p>
      </div>
    </div>
  );
}

function EmptyState({ loading, msg }: { loading: boolean; msg: string }) {
  return (
    <div className="king-empty">
      {loading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <ServerCrash size={20} />
      )}
      <span>{msg}</span>
    </div>
  );
}
