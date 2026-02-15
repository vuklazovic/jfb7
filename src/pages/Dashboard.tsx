import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Flame,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Wallet,
  Clock,
  ChevronRight,
} from 'lucide-react';
import {
  userProfile,
  budgetCategories,
  goals,
  recentTransactions,
  monthlySpendingTrend,
} from '../data/mockData';
import FinancialTetris from '../components/FinancialTetris';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
};

const monoFont: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatCurrency(amount: number, showSign = false): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  if (showSign && amount > 0) return `+${formatted}`;
  if (showSign && amount < 0) return `-${formatted}`;
  return formatted;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const Dashboard: React.FC = () => {
  const totalAllocated = useMemo(
    () => budgetCategories.reduce((sum, c) => sum + c.allocated, 0),
    []
  );
  const totalSpent = useMemo(
    () => budgetCategories.reduce((sum, c) => sum + c.spent, 0),
    []
  );
  const totalRemaining = userProfile.monthlyIncome - totalSpent;
  const flexSpace = userProfile.monthlyIncome - totalAllocated;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const spendProgress = totalSpent / userProfile.monthlyIncome;

  const todayStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const latestTransactions = recentTransactions.slice(0, 6);

  let motionIdx = 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        padding: '32px 24px 64px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* ─── Header ─── */}
      <motion.div
        custom={motionIdx++}
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '32px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {getGreeting()}, {userProfile.name.split(' ')[0]}
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--text-secondary)',
              margin: '6px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Calendar size={14} />
            {todayStr}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
          }}
        >
          <Flame size={18} style={{ color: 'var(--accent-orange)' }} />
          <span
            style={{
              ...monoFont,
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--accent-orange)',
            }}
          >
            {userProfile.streakDays}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}
          >
            day streak
          </span>
        </div>
      </motion.div>

      {/* ─── Main Grid ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '24px',
        }}
      >
        {/* ─── Financial Tetris ─── */}
        <motion.div
          custom={motionIdx++}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{ gridRow: 'span 2' }}
        >
          <FinancialTetris />
        </motion.div>

        {/* ─── Month Pulse ─── */}
        <motion.div
          custom={motionIdx++}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={cardStyle}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 20px',
            }}
          >
            Month Pulse
          </h2>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            {/* Circular progress */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <svg width="110" height="110" viewBox="0 0 110 110">
                {/* Background track */}
                <circle
                  cx="55"
                  cy="55"
                  r="46"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="8"
                />
                {/* Progress arc */}
                <motion.circle
                  cx="55"
                  cy="55"
                  r="46"
                  fill="none"
                  stroke={
                    spendProgress > 0.85
                      ? 'var(--accent-rose)'
                      : spendProgress > 0.65
                      ? 'var(--accent-orange)'
                      : 'var(--accent-emerald)'
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 46}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 46 * (1 - spendProgress),
                  }}
                  transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                  style={{
                    transform: 'rotate(-90deg)',
                    transformOrigin: '55px 55px',
                  }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    ...monoFont,
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {Math.round(spendProgress * 100)}%
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '10px',
                    color: 'var(--text-dim)',
                  }}
                >
                  spent
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                flex: 1,
              }}
            >
              {[
                {
                  label: 'Total Spent',
                  value: formatCurrency(totalSpent),
                  icon: <TrendingDown size={14} />,
                  color: 'var(--accent-rose)',
                },
                {
                  label: 'Remaining',
                  value: formatCurrency(totalRemaining),
                  icon: <Wallet size={14} />,
                  color: 'var(--accent-emerald)',
                },
                {
                  label: 'Days Left',
                  value: `${daysLeft}`,
                  icon: <Clock size={14} />,
                  color: 'var(--accent-sky)',
                },
                {
                  label: 'Flex Score',
                  value: `${userProfile.flexNumber}`,
                  icon: <TrendingUp size={14} />,
                  color: 'var(--accent-gold)',
                },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                  <span
                    style={{
                      ...monoFont,
                      fontSize: '18px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ─── Spending Trend Chart ─── */}
        <motion.div
          custom={motionIdx++}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={cardStyle}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Spending Trend
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '12px',
                color: 'var(--text-dim)',
              }}
            >
              6-month view
            </span>
          </div>
          <div style={{ width: '100%', height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlySpendingTrend}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent-emerald)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent-emerald)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--accent-violet)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--accent-violet)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--text-dim)',
                    fontSize: 11,
                    fontFamily: 'var(--font-body)',
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: 'var(--text-dim)',
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                  }}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                  formatter={(value: number | undefined) => [formatCurrency(value ?? 0)]}
                  labelStyle={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="var(--accent-emerald)"
                  strokeWidth={2}
                  fill="url(#incomeGrad)"
                  name="Income"
                />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="var(--accent-violet)"
                  strokeWidth={2}
                  fill="url(#spendGrad)"
                  name="Spending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginTop: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '12px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'var(--accent-emerald)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                }}
              >
                Income
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '12px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'var(--accent-violet)',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  color: 'var(--text-dim)',
                }}
              >
                Spending
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── Goals Progress ─── */}
        <motion.div
          custom={motionIdx++}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{
            ...cardStyle,
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={18} style={{ color: 'var(--accent-gold)' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Goals
              </h2>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              View all <ChevronRight size={14} />
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {goals.map((goal, i) => {
              const pct = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.4 + i * 0.1,
                    duration: 0.4,
                  }}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px',
                    transition: 'border-color 0.2s',
                  }}
                  whileHover={{
                    borderColor: goal.color,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '14px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '20px',
                          marginBottom: '6px',
                        }}
                      >
                        {goal.icon}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          margin: 0,
                        }}
                      >
                        {goal.name}
                      </h3>
                    </div>
                    <span
                      style={{
                        ...monoFont,
                        fontSize: '13px',
                        fontWeight: 700,
                        color: goal.color,
                      }}
                    >
                      {Math.round(pct)}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      height: '6px',
                      background: 'var(--bg-deep)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        delay: 0.6 + i * 0.1,
                        duration: 0.8,
                        ease: 'easeOut',
                      }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${goal.color}, ${goal.color}cc)`,
                        borderRadius: '3px',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        ...monoFont,
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {formatCurrency(goal.current)}{' '}
                      <span style={{ color: 'var(--text-dim)' }}>
                        / {formatCurrency(goal.target)}
                      </span>
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                      }}
                    >
                      {goal.deadline}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ─── Recent Transactions ─── */}
        <motion.div
          custom={motionIdx++}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          style={{
            ...cardStyle,
            gridColumn: '1 / -1',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Recent Transactions
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              See all <ChevronRight size={14} />
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {latestTransactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + i * 0.06,
                  duration: 0.35,
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 12px',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                whileHover={{
                  backgroundColor: 'var(--bg-card-hover)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      background:
                        tx.type === 'credit'
                          ? 'rgba(52,211,153,0.1)'
                          : 'rgba(244,63,94,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft
                        size={16}
                        style={{ color: 'var(--accent-emerald)' }}
                      />
                    ) : (
                      <ArrowUpRight
                        size={16}
                        style={{ color: 'var(--accent-rose)' }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                    >
                      {tx.merchant}
                    </p>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        margin: '2px 0 0',
                      }}
                    >
                      {tx.category}
                    </p>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      ...monoFont,
                      fontSize: '14px',
                      fontWeight: 600,
                      color:
                        tx.type === 'credit'
                          ? 'var(--accent-emerald)'
                          : 'var(--text-primary)',
                      margin: 0,
                    }}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </p>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '11px',
                      color: 'var(--text-dim)',
                      margin: '2px 0 0',
                    }}
                  >
                    {formatDate(tx.date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
