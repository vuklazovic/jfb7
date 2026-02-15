import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  DollarSign,
  Activity,
  ChevronRight,
  Shield,
  Zap,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { cashFlowForecast, userProfile } from '../data/mockData';

type TimeRange = 30 | 60 | 90;
type ScenarioMode = 'current' | 'saving';

const SAFE_MINIMUM = 500;
const EXTRA_SAVINGS_MONTHLY = 200;

const formatCurrency = (value: number): string => {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toLocaleString()}`;
};

const formatFullCurrency = (value: number): string => {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatDateFull = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const getDaysUntil = (dateStr: string): number => {
  const now = new Date();
  const target = new Date(dateStr);
  const diff = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const parseBillAmount = (bill: string): number => {
  const match = bill.match(/\$([\d,]+(?:\.\d+)?)/);
  return match ? parseFloat(match[1].replace(/,/g, '')) : 0;
};

const parseBillsTotal = (bills: string[]): number => {
  return bills.reduce((sum, bill) => sum + parseBillAmount(bill), 0);
};

const CircularGauge: React.FC<{ value: number; max: number; size?: number }> = ({
  value,
  max,
  size = 56,
}) => {
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;
  const color =
    value >= 70
      ? 'var(--accent-emerald)'
      : value >= 40
        ? 'var(--accent-orange)'
        : 'var(--accent-rose)';

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
};

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  if (!data) return null;

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-accent)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 18px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
        minWidth: 200,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--text-dim)',
          marginBottom: 10,
        }}
      >
        {formatDateFull(data.date)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: 'var(--text-secondary)',
            }}
          >
            Projected
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--accent-gold)',
            }}
          >
            {formatFullCurrency(data.projected)}
          </span>
        </div>

        {data.actual != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              Actual
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent-emerald)',
              }}
            >
              {formatFullCurrency(data.actual)}
            </span>
          </div>
        )}

        {data.savingsProjected != null && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--text-secondary)',
              }}
            >
              With Savings
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--accent-violet)',
              }}
            >
              {formatFullCurrency(data.savingsProjected)}
            </span>
          </div>
        )}

        {data.bills.length > 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 6,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ArrowDownRight size={12} /> Bills Due
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent-rose)',
              }}
            >
              {formatFullCurrency(parseBillsTotal(data.bills))}
            </span>
          </div>
        )}

        {data.income && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: data.bills.length > 0 ? 0 : 6,
              borderTop: data.bills.length > 0 ? 'none' : '1px solid var(--border-subtle)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 12,
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <ArrowUpRight size={12} /> Income
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent-emerald)',
              }}
            >
              Income Day
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const BillStatusDot: React.FC<{ status: 'safe' | 'warning' | 'danger' }> = ({ status }) => {
  const color =
    status === 'safe'
      ? 'var(--accent-emerald)'
      : status === 'warning'
        ? 'var(--accent-orange)'
        : 'var(--accent-rose)';

  return (
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: 'var(--radius-full)',
        background: color,
        boxShadow: `0 0 8px ${color}`,
        flexShrink: 0,
      }}
    />
  );
};

const CashFlow: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>(30);
  const [scenarioMode, setScenarioMode] = useState<ScenarioMode>('current');

  const filteredData = useMemo(() => {
    const sliced = cashFlowForecast.slice(0, timeRange);
    return sliced.map((entry, index) => {
      const dailySavingsBoost = (EXTRA_SAVINGS_MONTHLY / 30) * (index + 1);
      return {
        ...entry,
        savingsProjected:
          scenarioMode === 'saving' ? entry.projected + dailySavingsBoost : undefined,
      };
    });
  }, [timeRange, scenarioMode]);

  const projectedBalance = useMemo(() => {
    if (filteredData.length === 0) return 0;
    return filteredData[filteredData.length - 1].projected;
  }, [filteredData]);

  const lowestPoint = useMemo(() => {
    return filteredData.reduce(
      (min, entry) => (entry.projected < min ? entry.projected : min),
      Infinity
    );
  }, [filteredData]);

  const upcomingBillsNext7Days = useMemo(() => {
    const upcoming = filteredData.filter((entry) => {
      const days = getDaysUntil(entry.date);
      return days <= 7 && days >= 0 && entry.bills.length > 0;
    });
    return {
      count: upcoming.length,
      total: upcoming.reduce((sum, e) => sum + parseBillsTotal(e.bills), 0),
    };
  }, [filteredData]);

  const upcomingBillsList = useMemo(() => {
    return filteredData
      .filter((entry) => entry.bills.length > 0 && getDaysUntil(entry.date) >= 0)
      .slice(0, 5)
      .map((entry) => {
        const balanceAtDate = entry.projected;
        let status: 'safe' | 'warning' | 'danger' = 'safe';
        if (balanceAtDate < 0) status = 'danger';
        else if (balanceAtDate < SAFE_MINIMUM) status = 'warning';
        return {
          date: entry.date,
          amount: parseBillsTotal(entry.bills),
          daysUntil: getDaysUntil(entry.date),
          projectedBalance: balanceAtDate,
          status,
        };
      });
  }, [filteredData]);

  const incomeRhythmScore = 78;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  };

  const chartVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], delay: 0.3 },
    },
  };

  const timeRanges: TimeRange[] = [30, 60, 90];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: '32px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Cash Flow Forecast
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: 'var(--text-dim)',
              margin: '6px 0 0',
            }}
          >
            {userProfile?.name ? `${userProfile.name}'s` : 'Your'} projected cash flow for the next{' '}
            {timeRange} days
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 4,
            border: '1px solid var(--border-subtle)',
          }}
        >
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: timeRange === range ? 'var(--accent-gold)' : 'transparent',
                color: timeRange === range ? 'var(--bg-deep)' : 'var(--text-secondary)',
              }}
            >
              {range}D
            </button>
          ))}
        </div>
      </motion.div>

      {/* Key Metrics Row */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        {/* Projected Balance */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'var(--accent-gold-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={16} color="var(--accent-gold)" />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Projected Balance
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 26,
              fontWeight: 700,
              color: projectedBalance >= 0 ? 'var(--accent-gold)' : 'var(--accent-rose)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatFullCurrency(projectedBalance)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            End of {timeRange}-day period
          </div>
        </motion.div>

        {/* Lowest Point */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            border: `1px solid ${lowestPoint < SAFE_MINIMUM ? 'var(--accent-rose)' : 'var(--border-subtle)'}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {lowestPoint < SAFE_MINIMUM && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'var(--accent-rose)',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              }}
            />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background:
                  lowestPoint < SAFE_MINIMUM
                    ? 'rgba(255, 99, 132, 0.12)'
                    : 'var(--accent-emerald-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {lowestPoint < SAFE_MINIMUM ? (
                <AlertTriangle size={16} color="var(--accent-rose)" />
              ) : (
                <Shield size={16} color="var(--accent-emerald)" />
              )}
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Lowest Point
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 26,
              fontWeight: 700,
              color:
                lowestPoint < 0
                  ? 'var(--accent-rose)'
                  : lowestPoint < SAFE_MINIMUM
                    ? 'var(--accent-orange)'
                    : 'var(--accent-emerald)',
              letterSpacing: '-0.02em',
            }}
          >
            {formatFullCurrency(lowestPoint)}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {lowestPoint < SAFE_MINIMUM ? 'Below safe minimum' : 'Above safe minimum'}
          </div>
        </motion.div>

        {/* Upcoming Bills */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={16} color="var(--accent-violet)" />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Upcoming Bills
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--accent-violet)',
                letterSpacing: '-0.02em',
              }}
            >
              {upcomingBillsNext7Days.count}
            </span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              totaling {formatFullCurrency(upcomingBillsNext7Days.total)}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Next 7 days</div>
        </motion.div>

        {/* Income Rhythm Score */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(56, 189, 248, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={16} color="var(--accent-sky)" />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Income Rhythm
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <CircularGauge value={incomeRhythmScore} max={100} />
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--accent-emerald)',
                }}
              >
                {incomeRhythmScore}/100
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
                Consistent
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scenario Toggle */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Scenario
        </span>
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            padding: 3,
            border: '1px solid var(--border-subtle)',
          }}
        >
          <button
            onClick={() => setScenarioMode('current')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: scenarioMode === 'current' ? 'var(--accent-gold-dim)' : 'transparent',
              color: scenarioMode === 'current' ? 'var(--accent-gold)' : 'var(--text-secondary)',
            }}
          >
            <TrendingUp size={13} />
            Current Path
          </button>
          <button
            onClick={() => setScenarioMode('saving')}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: scenarioMode === 'saving' ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
              color: scenarioMode === 'saving' ? 'var(--accent-violet)' : 'var(--text-secondary)',
            }}
          >
            <Zap size={13} />
            If I Save $200/mo More
          </button>
        </div>
      </motion.div>

      {/* Main Chart */}
      <motion.div
        variants={chartVariants}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 20px 20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: 28,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle glow effect behind the chart */}
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '20%',
            width: '60%',
            height: '40%',
            background:
              'radial-gradient(ellipse, rgba(255, 193, 7, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            filter: 'blur(40px)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingLeft: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, borderRadius: 2, background: 'var(--accent-gold)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Projected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, borderRadius: 2, background: 'var(--accent-emerald)' }} />
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Actual</span>
            </div>
            {scenarioMode === 'saving' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <div style={{ width: 12, height: 3, borderRadius: 2, background: 'var(--accent-violet)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>+$200/mo Savings</span>
              </motion.div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 16, height: 0, borderTop: '2px dashed var(--accent-rose)', opacity: 0.7 }} />
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>$0 line</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 16, height: 0, borderTop: '2px dashed var(--accent-orange)', opacity: 0.5 }} />
              <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>Safe min ($500)</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={filteredData} margin={{ top: 10, right: 16, left: 8, bottom: 10 }}>
            <defs>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity={0.35} />
                <stop offset="50%" stopColor="var(--accent-gold)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-emerald)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent-emerald)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity={0.02} />
              </linearGradient>
              <filter id="glowGold">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="3 6"
              stroke="var(--border-subtle)"
              strokeOpacity={0.4}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="var(--text-dim)"
              tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--text-dim)' }}
              axisLine={{ stroke: 'var(--border-subtle)', strokeOpacity: 0.5 }}
              tickLine={false}
              interval={Math.floor(filteredData.length / 8)}
              dy={8}
            />

            <YAxis
              tickFormatter={formatCurrency}
              stroke="var(--text-dim)"
              tick={{ fontSize: 11, fontFamily: 'var(--font-mono)', fill: 'var(--text-dim)' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />

            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              y={0}
              stroke="var(--accent-rose)"
              strokeDasharray="6 4"
              strokeOpacity={0.7}
              label={{
                value: 'DANGER',
                position: 'insideTopRight',
                fill: 'var(--accent-rose)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
              }}
            />

            <ReferenceLine
              y={SAFE_MINIMUM}
              stroke="var(--accent-orange)"
              strokeDasharray="4 6"
              strokeOpacity={0.5}
              label={{
                value: 'SAFE MIN',
                position: 'insideTopRight',
                fill: 'var(--accent-orange)',
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                opacity: 0.7,
              }}
            />

            {/* Projected balance area */}
            <Area
              type="monotone"
              dataKey="projected"
              stroke="var(--accent-gold)"
              strokeWidth={2.5}
              fill="url(#projectedGradient)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.bills && payload.bills.length > 0) {
                  return (
                    <circle
                      key={`bill-${cx}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="var(--accent-rose)"
                      stroke="var(--bg-card)"
                      strokeWidth={2}
                    />
                  );
                }
                if (payload.income) {
                  return (
                    <circle
                      key={`income-${cx}`}
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="var(--accent-emerald)"
                      stroke="var(--bg-card)"
                      strokeWidth={2}
                    />
                  );
                }
                return <circle key={`empty-${cx}`} cx={0} cy={0} r={0} fill="none" />;
              }}
              activeDot={{
                r: 6,
                stroke: 'var(--accent-gold)',
                strokeWidth: 2,
                fill: 'var(--bg-card)',
              }}
              animationDuration={1200}
              animationEasing="ease-out"
              filter="url(#glowGold)"
            />

            {/* Actual data overlay */}
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--accent-emerald)"
              strokeWidth={2}
              fill="url(#actualGradient)"
              dot={false}
              activeDot={{
                r: 5,
                stroke: 'var(--accent-emerald)',
                strokeWidth: 2,
                fill: 'var(--bg-card)',
              }}
              animationDuration={1000}
              animationEasing="ease-out"
              connectNulls={false}
            />

            {/* Savings scenario overlay */}
            {scenarioMode === 'saving' && (
              <Area
                type="monotone"
                dataKey="savingsProjected"
                stroke="var(--accent-violet)"
                strokeWidth={2}
                strokeDasharray="6 3"
                fill="url(#savingsGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  stroke: 'var(--accent-violet)',
                  strokeWidth: 2,
                  fill: 'var(--bg-card)',
                }}
                animationDuration={800}
                animationEasing="ease-out"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Upcoming Bills List */}
      <motion.div variants={itemVariants}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Upcoming Bills
          </h2>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            Next 5 due dates
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <AnimatePresence mode="popLayout">
            {upcomingBillsList.map((bill, index) => (
              <motion.div
                key={bill.date + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                whileHover={{ scale: 1.01, x: 4 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                  border: `1px solid ${
                    bill.status === 'danger'
                      ? 'var(--accent-rose)'
                      : bill.status === 'warning'
                        ? 'var(--accent-orange)'
                        : 'var(--border-subtle)'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'default',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <BillStatusDot status={bill.status} />
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        marginBottom: 3,
                      }}
                    >
                      {formatDateFull(bill.date)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--text-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Clock size={11} />
                        {bill.daysUntil === 0
                          ? 'Due today'
                          : bill.daysUntil === 1
                            ? 'Due tomorrow'
                            : `${bill.daysUntil} days away`}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color:
                            bill.status === 'danger'
                              ? 'var(--accent-rose)'
                              : bill.status === 'warning'
                                ? 'var(--accent-orange)'
                                : 'var(--text-dim)',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        Balance: {formatFullCurrency(bill.projectedBalance)}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 16,
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    -{formatFullCurrency(bill.amount)}
                  </div>
                  <ChevronRight size={16} color="var(--text-dim)" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {upcomingBillsList.length === 0 && (
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                padding: '40px 20px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'center',
              }}
            >
              <DollarSign
                size={28}
                color="var(--text-dim)"
                style={{ marginBottom: 8, opacity: 0.5 }}
              />
              <div style={{ fontSize: 14, color: 'var(--text-dim)' }}>
                No upcoming bills in this period
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Savings scenario summary */}
      <AnimatePresence>
        {scenarioMode === 'saving' && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              marginTop: 24,
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.02) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px 24px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Zap size={18} color="var(--accent-violet)" />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--accent-violet)',
                }}
              >
                Savings Scenario Impact
              </span>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>
                  Additional saved over {timeRange} days
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--accent-violet)',
                  }}
                >
                  +{formatFullCurrency((EXTRA_SAVINGS_MONTHLY / 30) * timeRange)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}>
                  New projected end balance
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--accent-violet)',
                  }}
                >
                  {formatFullCurrency(
                    projectedBalance + (EXTRA_SAVINGS_MONTHLY / 30) * timeRange
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CashFlow;
