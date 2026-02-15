import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  Snowflake,
  Mountain,
  Calendar,
  DollarSign,
  Percent,
  CreditCard,
  Target,
  Zap,
  ChevronDown,
  ChevronUp,
  Clock,
  ArrowDown,
  Flame,
  PartyPopper,
} from 'lucide-react';
import { debts } from '../data/mockData';

// ── helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const fmtDecimal = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const ordinal = (d: number) => {
  if (d > 3 && d < 21) return `${d}th`;
  const s = ['th', 'st', 'nd', 'rd'];
  return `${d}${s[d % 10] || s[0]}`;
};

// ── simulation engine ────────────────────────────────────────────────────────

interface SimResult {
  months: number;
  totalInterest: number;
  order: typeof debts;
}

function simulate(
  sortedDebts: typeof debts,
  extraMonthly: number,
): SimResult {
  const balances = new Map(sortedDebts.map((d) => [d.id, d.balance]));
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600; // safety cap

  while (months < maxMonths) {
    const allPaid = sortedDebts.every((d) => (balances.get(d.id) ?? 0) <= 0);
    if (allPaid) break;
    months++;

    // accrue interest
    for (const d of sortedDebts) {
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const interest = bal * (d.interestRate / 100 / 12);
      totalInterest += interest;
      balances.set(d.id, bal + interest);
    }

    // pay minimums
    let surplus = extraMonthly;
    for (const d of sortedDebts) {
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const payment = Math.min(d.minimumPayment, bal);
      balances.set(d.id, bal - payment);
    }

    // pay extra toward first unpaid debt in order
    for (const d of sortedDebts) {
      const bal = balances.get(d.id) ?? 0;
      if (bal <= 0) continue;
      const extra = Math.min(surplus, bal);
      balances.set(d.id, bal - extra);
      surplus -= extra;
      if (surplus <= 0) break;
    }
  }

  return { months, totalInterest: Math.round(totalInterest), order: sortedDebts };
}

// ── component ────────────────────────────────────────────────────────────────

export default function DebtPayoff() {
  const [strategy, setStrategy] = useState<'snowball' | 'avalanche'>('avalanche');
  const [extraPayment, setExtraPayment] = useState(100);
  const [expandedDebt, setExpandedDebt] = useState<string | null>(null);

  // derived data
  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalOriginal = debts.reduce((s, d) => s + d.originalBalance, 0);
  const totalPaid = totalOriginal - totalDebt;
  const progressPct = (totalPaid / totalOriginal) * 100;
  const avgRate = debts.reduce((s, d) => s + d.interestRate, 0) / debts.length;
  const monthlyMinimum = debts.reduce((s, d) => s + d.minimumPayment, 0);

  const snowballOrder = useMemo(
    () => [...debts].sort((a, b) => a.balance - b.balance),
    [],
  );
  const avalancheOrder = useMemo(
    () => [...debts].sort((a, b) => b.interestRate - a.interestRate),
    [],
  );

  const snowballResult = useMemo(() => simulate(snowballOrder, extraPayment), [snowballOrder, extraPayment]);
  const avalancheResult = useMemo(() => simulate(avalancheOrder, extraPayment), [avalancheOrder, extraPayment]);

  const baseSnowball = useMemo(() => simulate(snowballOrder, 0), [snowballOrder]);
  const baseAvalanche = useMemo(() => simulate(avalancheOrder, 0), [avalancheOrder]);

  const activeResult = strategy === 'snowball' ? snowballResult : avalancheResult;
  const baseResult = strategy === 'snowball' ? baseSnowball : baseAvalanche;
  const monthsSaved = baseResult.months - activeResult.months;
  const interestSaved = baseResult.totalInterest - activeResult.totalInterest;

  const debtFreeDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + activeResult.months);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [activeResult.months]);

  const activeOrder = strategy === 'snowball' ? snowballOrder : avalancheOrder;

  // ── styles ─────────────────────────────────────────────────────────────────

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--bg-deep)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    padding: '32px 24px 80px',
    maxWidth: 900,
    margin: '0 auto',
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-subtle)',
    padding: '20px 24px',
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div style={pageStyle}>
      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 40 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <TrendingDown size={28} style={{ color: 'var(--accent-emerald)' }} />
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-primary)',
          }}>
            Debt Payoff
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 48,
            fontWeight: 700,
            color: 'var(--accent-rose)',
            letterSpacing: '-2px',
            lineHeight: 1.1,
          }}
        >
          {fmt(totalDebt)}
        </motion.div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--text-dim)',
          margin: '4px 0 0',
        }}>
          Total remaining balance across {debts.length} accounts
        </p>
      </motion.div>

      {/* ── SUMMARY STATS ──────────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 16,
        marginBottom: 40,
      }}>
        {[
          { label: 'Total Debt', value: fmt(totalDebt), icon: DollarSign, color: 'var(--accent-rose)', dimColor: 'var(--accent-rose-dim)' },
          { label: 'Avg Interest Rate', value: `${avgRate.toFixed(1)}%`, icon: Percent, color: 'var(--accent-orange)', dimColor: 'var(--accent-orange-dim)' },
          { label: 'Monthly Minimums', value: fmt(monthlyMinimum), icon: CreditCard, color: 'var(--accent-sky)', dimColor: 'var(--accent-sky-dim)' },
          { label: 'Progress', value: `${progressPct.toFixed(1)}%`, icon: Target, color: 'var(--accent-emerald)', dimColor: 'var(--accent-emerald-dim)' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            style={{
              ...cardStyle,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: stat.dimColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{stat.label}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 24,
              fontWeight: 700,
              color: stat.color,
            }}>
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── DEBT THERMOMETER + CARDS ─────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr',
        gap: 24,
        marginBottom: 48,
      }}>
        {/* Thermometer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{
            position: 'relative',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            minHeight: 400,
          }}
        >
          {/* filled portion from bottom */}
          <motion.div
            initial={{ height: '0%' }}
            animate={{ height: `${(totalDebt / totalOriginal) * 100}%` }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, var(--accent-rose), var(--accent-orange))',
              borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
            }}
          />
          {/* marker line for current position */}
          <motion.div
            initial={{ bottom: '0%' }}
            animate={{ bottom: `${(totalDebt / totalOriginal) * 100}%` }}
            transition={{ delay: 0.8, duration: 1.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: -4,
              right: -4,
              height: 3,
              background: 'var(--text-primary)',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 0 8px rgba(255,255,255,0.3)',
            }}
          />
          {/* top label */}
          <div style={{
            position: 'absolute',
            top: 8,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-emerald)',
            fontWeight: 600,
          }}>
            $0
          </div>
          {/* bottom label */}
          <div style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontSize: 9,
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-dim)',
            fontWeight: 600,
          }}>
            {fmt(totalOriginal)}
          </div>
        </motion.div>

        {/* Debt Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {debts.map((debt, i) => {
            const paidPct = ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;
            const isExpanded = expandedDebt === debt.id;

            return (
              <motion.div
                key={debt.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.45 }}
                onClick={() => setExpandedDebt(isExpanded ? null : debt.id)}
                style={{
                  ...cardStyle,
                  borderLeft: `4px solid ${debt.color}`,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                whileHover={{ background: 'var(--bg-card-hover)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 16,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        {debt.name}
                      </span>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: debt.color.replace(')', '-dim)'),
                        color: debt.color,
                        fontWeight: 600,
                      }}>
                        {debt.type}
                      </span>
                    </div>
                    <span style={{
                      fontSize: 12,
                      color: 'var(--text-dim)',
                    }}>
                      {debt.interestRate}% APR
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 22,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {fmt(debt.balance)}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                      of {fmt(debt.originalBalance)}
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{
                  marginTop: 12,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-deep)',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${paidPct}%` }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      borderRadius: 'var(--radius-full)',
                      background: `linear-gradient(90deg, ${debt.color}, ${debt.color}dd)`,
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 6,
                  fontSize: 11,
                  color: 'var(--text-dim)',
                }}>
                  <span>{paidPct.toFixed(0)}% paid off</span>
                  <span>{fmt(debt.originalBalance - debt.balance)} paid</span>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{
                        marginTop: 16,
                        paddingTop: 16,
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                      }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 2 }}>Monthly Payment</div>
                          <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 18,
                            fontWeight: 600,
                            color: debt.color,
                          }}>
                            {fmtDecimal(debt.minimumPayment)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 2 }}>Due Date</div>
                          <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 18,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                          }}>
                            {ordinal(debt.dueDate)} of month
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 8,
                }}>
                  {isExpanded
                    ? <ChevronUp size={14} style={{ color: 'var(--text-dim)' }} />
                    : <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
                  }
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── STRATEGY COMPARISON ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ marginBottom: 48 }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
          color: 'var(--text-primary)',
        }}>
          Payoff Strategy
        </h2>

        {/* Strategy Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: 4,
          marginBottom: 24,
        }}>
          {(['snowball', 'avalanche'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: 15,
                fontWeight: 600,
                transition: 'all 0.25s',
                background: strategy === s
                  ? s === 'snowball' ? 'var(--accent-sky-dim)' : 'var(--accent-rose-dim)'
                  : 'transparent',
                color: strategy === s
                  ? s === 'snowball' ? 'var(--accent-sky)' : 'var(--accent-rose)'
                  : 'var(--text-dim)',
              }}
            >
              {s === 'snowball' ? <Snowflake size={18} /> : <Mountain size={18} />}
              {s === 'snowball' ? 'Snowball' : 'Avalanche'}
            </button>
          ))}
        </div>

        {/* Strategy Details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 24,
        }}>
          {/* Snowball card */}
          <motion.div
            layout
            style={{
              ...cardStyle,
              border: strategy === 'snowball' ? '2px solid var(--accent-sky)' : '1px solid var(--border-subtle)',
              background: strategy === 'snowball' ? 'var(--bg-elevated)' : 'var(--bg-card)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {strategy === 'snowball' && (
              <motion.div
                layoutId="strategy-glow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, var(--accent-sky), var(--accent-sky-dim))',
                }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Snowflake size={20} style={{ color: 'var(--accent-sky)' }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontWeight: 600,
                color: strategy === 'snowball' ? 'var(--accent-sky)' : 'var(--text-secondary)',
              }}>
                Snowball
              </span>
            </div>
            <p style={{
              fontSize: 12,
              color: 'var(--text-dim)',
              margin: '0 0 16px',
              lineHeight: 1.5,
            }}>
              Pay smallest balance first. Quick wins build momentum.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Total Interest</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {fmt(snowballResult.totalInterest)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Months to Debt-Free</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {snowballResult.months}
                </div>
              </div>
              {snowballResult.totalInterest > avalancheResult.totalInterest && (
                <div style={{
                  fontSize: 12,
                  color: 'var(--accent-rose)',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-rose-dim)',
                }}>
                  +{fmt(snowballResult.totalInterest - avalancheResult.totalInterest)} more interest
                </div>
              )}
              {snowballResult.totalInterest <= avalancheResult.totalInterest && (
                <div style={{
                  fontSize: 12,
                  color: 'var(--accent-emerald)',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-emerald-dim)',
                }}>
                  Saves {fmt(avalancheResult.totalInterest - snowballResult.totalInterest)} in interest
                </div>
              )}
            </div>
          </motion.div>

          {/* Avalanche card */}
          <motion.div
            layout
            style={{
              ...cardStyle,
              border: strategy === 'avalanche' ? '2px solid var(--accent-rose)' : '1px solid var(--border-subtle)',
              background: strategy === 'avalanche' ? 'var(--bg-elevated)' : 'var(--bg-card)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {strategy === 'avalanche' && (
              <motion.div
                layoutId="strategy-glow"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: 'linear-gradient(90deg, var(--accent-rose), var(--accent-orange))',
                }}
              />
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Mountain size={20} style={{ color: 'var(--accent-rose)' }} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontWeight: 600,
                color: strategy === 'avalanche' ? 'var(--accent-rose)' : 'var(--text-secondary)',
              }}>
                Avalanche
              </span>
            </div>
            <p style={{
              fontSize: 12,
              color: 'var(--text-dim)',
              margin: '0 0 16px',
              lineHeight: 1.5,
            }}>
              Pay highest interest first. Mathematically optimal.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Total Interest</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {fmt(avalancheResult.totalInterest)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Months to Debt-Free</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  {avalancheResult.months}
                </div>
              </div>
              {avalancheResult.totalInterest > snowballResult.totalInterest && (
                <div style={{
                  fontSize: 12,
                  color: 'var(--accent-rose)',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-rose-dim)',
                }}>
                  +{fmt(avalancheResult.totalInterest - snowballResult.totalInterest)} more interest
                </div>
              )}
              {avalancheResult.totalInterest <= snowballResult.totalInterest && (
                <div style={{
                  fontSize: 12,
                  color: 'var(--accent-emerald)',
                  fontWeight: 600,
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-emerald-dim)',
                }}>
                  Saves {fmt(snowballResult.totalInterest - avalancheResult.totalInterest)} in interest
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reordered debt list */}
        <div style={{
          ...cardStyle,
          padding: '16px 20px',
        }}>
          <div style={{
            fontSize: 13,
            color: 'var(--text-dim)',
            marginBottom: 12,
            fontWeight: 600,
          }}>
            {strategy === 'snowball' ? 'Snowball' : 'Avalanche'} Order — attack from{' '}
            {strategy === 'snowball' ? 'smallest balance' : 'highest interest'} first
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {activeOrder.map((debt, i) => (
              <motion.div
                key={debt.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: i === 0 ? (strategy === 'snowball' ? 'var(--accent-sky-dim)' : 'var(--accent-rose-dim)') : 'var(--bg-deep)',
                  border: i === 0 ? `1px solid ${strategy === 'snowball' ? 'var(--accent-sky)' : 'var(--accent-rose)'}` : '1px solid transparent',
                }}
              >
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: 'var(--radius-full)',
                  background: i === 0 ? (strategy === 'snowball' ? 'var(--accent-sky)' : 'var(--accent-rose)') : 'var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  color: i === 0 ? 'var(--bg-deep)' : 'var(--text-dim)',
                  flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: 'var(--radius-full)',
                  background: debt.color,
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <span style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {debt.name}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    {fmt(debt.balance)}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: strategy === 'avalanche' ? 'var(--accent-orange)' : 'var(--text-dim)',
                    fontWeight: strategy === 'avalanche' ? 600 : 400,
                  }}>
                    {debt.interestRate}% APR
                  </div>
                </div>
                {i === 0 && (
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    <Zap size={16} style={{ color: strategy === 'snowball' ? 'var(--accent-sky)' : 'var(--accent-rose)' }} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── EXTRA PAYMENT SLIDER ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{
          ...cardStyle,
          padding: '28px 28px 32px',
          marginBottom: 48,
          border: '1px solid var(--border-accent)',
          background: 'var(--bg-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-emerald-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame size={20} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
              color: 'var(--text-primary)',
            }}>
              Extra Payment Power
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-dim)', margin: 0 }}>
              See how extra payments accelerate your freedom
            </p>
          </div>
        </div>

        {/* Slider */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 10,
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Extra per month</span>
            <motion.span
              key={extraPayment}
              initial={{ scale: 1.3, color: 'var(--accent-emerald)' }}
              animate={{ scale: 1, color: 'var(--text-primary)' }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {fmt(extraPayment)}
            </motion.span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="range"
              min={0}
              max={500}
              step={25}
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              style={{
                width: '100%',
                height: 8,
                borderRadius: 'var(--radius-full)',
                outline: 'none',
                appearance: 'none',
                WebkitAppearance: 'none',
                background: `linear-gradient(90deg, var(--accent-emerald) ${(extraPayment / 500) * 100}%, var(--bg-deep) ${(extraPayment / 500) * 100}%)`,
                cursor: 'pointer',
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 6,
              fontSize: 11,
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
            }}>
              <span>$0</span>
              <span>$125</span>
              <span>$250</span>
              <span>$375</span>
              <span>$500</span>
            </div>
          </div>
        </div>

        {/* Impact metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 16,
        }}>
          <motion.div
            key={`months-${monthsSaved}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              textAlign: 'center',
            }}
          >
            <Clock size={18} style={{ color: 'var(--accent-sky)', marginBottom: 6 }} />
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 26,
              fontWeight: 700,
              color: monthsSaved > 0 ? 'var(--accent-emerald)' : 'var(--text-dim)',
            }}>
              {monthsSaved > 0 ? `-${monthsSaved}` : '0'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              months faster
            </div>
          </motion.div>

          <motion.div
            key={`interest-${interestSaved}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              textAlign: 'center',
            }}
          >
            <DollarSign size={18} style={{ color: 'var(--accent-gold)', marginBottom: 6 }} />
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 26,
              fontWeight: 700,
              color: interestSaved > 0 ? 'var(--accent-emerald)' : 'var(--text-dim)',
            }}>
              {interestSaved > 0 ? fmt(interestSaved) : '$0'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              interest saved
            </div>
          </motion.div>

          <motion.div
            key={`date-${debtFreeDate}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: extraPayment > 0 ? 'var(--accent-emerald-dim)' : 'var(--bg-card)',
              textAlign: 'center',
              border: extraPayment > 0 ? '1px solid var(--accent-emerald)' : '1px solid transparent',
            }}
          >
            <PartyPopper size={18} style={{ color: 'var(--accent-emerald)', marginBottom: 6 }} />
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--accent-emerald)',
              lineHeight: 1.3,
            }}>
              {debtFreeDate}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>
              debt-free date
            </div>
          </motion.div>
        </div>

        {/* Motivational message */}
        <AnimatePresence mode="wait">
          {extraPayment >= 250 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: 20,
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--accent-emerald-dim), var(--accent-gold-dim))',
                border: '1px solid var(--accent-emerald)',
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent-emerald)',
              }}
            >
              {extraPayment >= 400
                ? 'Incredible commitment! You are crushing this debt.'
                : 'Amazing! That extra push makes a huge difference.'}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── FULL DEBT THERMOMETER (large) ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ marginBottom: 32 }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
          color: 'var(--text-primary)',
        }}>
          Debt Thermometer
        </h2>

        <div style={{
          ...cardStyle,
          padding: '32px',
          display: 'flex',
          alignItems: 'stretch',
          gap: 32,
        }}>
          {/* Vertical thermometer */}
          <div style={{
            width: 80,
            minHeight: 340,
            position: 'relative',
            background: 'var(--bg-deep)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            flexShrink: 0,
          }}>
            {/* Filled portion */}
            <motion.div
              initial={{ height: '0%' }}
              animate={{ height: `${(totalDebt / totalOriginal) * 100}%` }}
              transition={{ delay: 1.2, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, var(--accent-rose), var(--accent-orange), var(--accent-gold))',
                borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
              }}
            />

            {/* Individual debt segments */}
            {debts.map((debt, i) => {
              const beforePct = debts.slice(0, i).reduce((s, d) => s + d.balance, 0) / totalOriginal * 100;
              const segPct = (debt.balance / totalOriginal) * 100;
              return (
                <motion.div
                  key={debt.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  transition={{ delay: 1.5 + i * 0.15, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    bottom: `${beforePct}%`,
                    left: 0,
                    right: 0,
                    height: `${segPct}%`,
                    background: debt.color,
                    borderTop: '1px solid rgba(0,0,0,0.2)',
                  }}
                />
              );
            })}

            {/* Current position marker */}
            <motion.div
              initial={{ bottom: '0%', opacity: 0 }}
              animate={{ bottom: `${(totalDebt / totalOriginal) * 100}%`, opacity: 1 }}
              transition={{ delay: 1.4, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'absolute',
                left: -6,
                right: -6,
                height: 4,
                background: 'var(--text-primary)',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 0 12px rgba(255,255,255,0.4)',
                zIndex: 2,
              }}
            >
              <div style={{
                position: 'absolute',
                right: -70,
                top: -8,
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
              }}>
                {fmt(totalDebt)}
              </div>
            </motion.div>
          </div>

          {/* Scale labels */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--accent-emerald)',
                marginBottom: 4,
              }}>
                $0 — DEBT FREE
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                The finish line. Keep going!
              </div>
            </div>

            <div style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-deep)',
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 6 }}>You have paid off</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--accent-emerald)',
              }}>
                {fmt(totalPaid)}
              </div>
              <div style={{
                fontSize: 13,
                color: 'var(--text-secondary)',
                marginTop: 4,
              }}>
                That is {progressPct.toFixed(1)}% of your original {fmt(totalOriginal)} debt
              </div>

              {/* Mini breakdown */}
              <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {debts.map((debt) => {
                  const debtPaidPct = ((debt.originalBalance - debt.balance) / debt.originalBalance) * 100;
                  return (
                    <div key={debt.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: 'var(--radius-full)',
                        background: debt.color,
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{debt.name}</span>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-dim)',
                      }}>
                        {debtPaidPct.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 16,
                fontWeight: 700,
                color: 'var(--accent-rose)',
                marginBottom: 4,
              }}>
                {fmt(totalOriginal)} — Original Balance
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                Where you started. Look how far you have come.
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── INLINE SLIDER STYLES ───────────────────────────────────────── */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-emerald);
          cursor: pointer;
          border: 3px solid var(--bg-elevated);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px var(--accent-emerald-dim);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 14px rgba(0, 0, 0, 0.3), 0 0 28px var(--accent-emerald-dim);
        }
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--accent-emerald);
          cursor: pointer;
          border: 3px solid var(--bg-elevated);
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px var(--accent-emerald-dim);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 9999px;
        }
        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: var(--bg-deep);
        }
      `}</style>
    </div>
  );
}
