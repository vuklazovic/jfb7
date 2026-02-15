import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  ArrowUpRight,
  X,
  DollarSign,
  AlertTriangle,
  LayoutGrid,
} from 'lucide-react';
import { subscriptions } from '../data/mockData';
import { userProfile } from '../data/mockData';

const MONTHLY_INCOME = userProfile.monthlyIncome;

function ordinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const cardStyle: React.CSSProperties = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: '24px',
};

export default function Subscriptions() {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(subscriptions.map((s) => s.category)));
    return ['All', ...cats.sort()];
  }, []);

  const filteredSubscriptions = useMemo(() => {
    if (activeCategory === 'All') return subscriptions;
    return subscriptions.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const totalMonthly = useMemo(
    () => subscriptions.reduce((sum, s) => sum + s.amount, 0),
    []
  );

  const annualCost = totalMonthly * 12;

  const priceIncreases = useMemo(() => {
    const ups = subscriptions.filter((s) => s.trend === 'up');
    return {
      count: ups.length,
      totalIncrease: ups.reduce((sum, s) => sum + (s.lastChange || 0), 0),
    };
  }, []);

  // Build calendar data for next 30 days
  const today = new Date();
  const calendarDays = useMemo(() => {
    const days: { date: Date; dayNum: number; subs: typeof subscriptions }[] = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dayOfMonth = d.getDate();
      const matchingSubs = subscriptions.filter(
        (s) => s.billingDate === dayOfMonth
      );
      days.push({ date: d, dayNum: dayOfMonth, subs: matchingSubs });
    }
    return days;
  }, []);

  // Tetris block data: each subscription as a block proportional to its cost
  const tetrisBlocks = useMemo(() => {
    const sorted = [...subscriptions].sort((a, b) => b.amount - a.amount);
    const total = sorted.reduce((s, sub) => s + sub.amount, 0);
    return sorted.map((sub) => ({
      ...sub,
      percentage: (sub.amount / MONTHLY_INCOME) * 100,
      ofTotal: (sub.amount / total) * 100,
    }));
  }, []);

  const totalPercentOfIncome = (totalMonthly / MONTHLY_INCOME) * 100;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        padding: '32px 24px 80px',
        maxWidth: '960px',
        margin: '0 auto',
      }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '32px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Subscriptions
          </h1>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '32px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              {formatCurrency(totalMonthly)}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-dim)',
                marginTop: '2px',
              }}
            >
              {subscriptions.length} active subscriptions
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Summary Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Total Monthly */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-emerald-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-dim)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Total Monthly
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {formatCurrency(totalMonthly)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginTop: '4px',
            }}
          >
            {totalPercentOfIncome.toFixed(1)}% of income
          </div>
        </div>

        {/* Annual Cost */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-violet-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calendar size={18} style={{ color: 'var(--accent-violet)' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-dim)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Annual Cost
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {formatCurrency(annualCost)}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginTop: '4px',
            }}
          >
            projected yearly spend
          </div>
        </div>

        {/* Price Increases */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-rose-dim)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} />
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-dim)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Price Increases
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--accent-rose)',
            }}
          >
            {priceIncreases.count}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginTop: '4px',
            }}
          >
            +{formatCurrency(priceIncreases.totalIncrease)}/mo total
          </div>
        </div>
      </motion.div>

      {/* ── Category Filter ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px',
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: isActive
                  ? '1px solid var(--accent-gold)'
                  : '1px solid var(--border-subtle)',
                background: isActive ? 'var(--accent-gold-dim)' : 'var(--bg-card)',
                color: isActive ? 'var(--accent-gold)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
            >
              {cat}
            </button>
          );
        })}
      </motion.div>

      {/* ── Subscription List ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          {filteredSubscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              variants={itemVariants}
              whileHover={{
                scale: 1.008,
                boxShadow: 'var(--shadow-card)',
              }}
              style={{
                ...cardStyle,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                cursor: 'default',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  'var(--bg-card)';
              }}
            >
              {/* Logo */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  flexShrink: 0,
                }}
              >
                {sub.logo}
              </div>

              {/* Name + Category */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {sub.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: 'var(--text-dim)',
                    marginTop: '2px',
                  }}
                >
                  {sub.category}
                </div>
              </div>

              {/* Billing Date */}
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Due on the {ordinalSuffix(sub.billingDate)}
              </div>

              {/* Amount */}
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  minWidth: '72px',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                {formatCurrency(sub.amount)}
              </div>

              {/* Trend Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  minWidth: '80px',
                  flexShrink: 0,
                }}
              >
                {sub.trend === 'up' && (
                  <>
                    <TrendingUp
                      size={16}
                      style={{ color: 'var(--accent-rose)' }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--accent-rose)',
                        fontWeight: 600,
                      }}
                    >
                      +{formatCurrency(sub.lastChange || 0)}
                    </span>
                  </>
                )}
                {sub.trend === 'down' && (
                  <>
                    <TrendingDown
                      size={16}
                      style={{ color: 'var(--accent-emerald)' }}
                    />
                    {sub.lastChange && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: 'var(--accent-emerald)',
                          fontWeight: 600,
                        }}
                      >
                        {formatCurrency(sub.lastChange)}
                      </span>
                    )}
                  </>
                )}
                {sub.trend === 'stable' && (
                  <Minus
                    size={16}
                    style={{ color: 'var(--text-dim)' }}
                  />
                )}
              </div>

              {/* Cancel Button */}
              <button
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  background: 'transparent',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--accent-rose)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--accent-rose)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    'var(--border-subtle)';
                  (e.currentTarget as HTMLButtonElement).style.color =
                    'var(--text-dim)';
                }}
              >
                <X size={12} />
                Cancel
              </button>
            </motion.div>
          ))}

          {filteredSubscriptions.length === 0 && (
            <motion.div
              variants={itemVariants}
              style={{
                ...cardStyle,
                textAlign: 'center',
                padding: '48px 24px',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
              }}
            >
              No subscriptions in this category.
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Calendar View ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        style={{ marginBottom: '40px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <Calendar size={18} style={{ color: 'var(--accent-sky)' }} />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Upcoming Renewals
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginLeft: '4px',
            }}
          >
            next 30 days
          </span>
        </div>
        <div
          style={{
            ...cardStyle,
            padding: '20px',
            overflowX: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '2px',
              minWidth: 'fit-content',
            }}
          >
            {calendarDays.map((day, i) => {
              const hasSubs = day.subs.length > 0;
              const isToday = i === 0;
              const dayLabel = day.date.toLocaleDateString('en-US', {
                weekday: 'narrow',
              });
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    minWidth: '28px',
                    position: 'relative',
                  }}
                  title={
                    hasSubs
                      ? day.subs
                          .map((s) => `${s.name} - ${formatCurrency(s.amount)}`)
                          .join('\n')
                      : undefined
                  }
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '9px',
                      color: 'var(--text-dim)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {dayLabel}
                  </div>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: hasSubs ? 700 : 400,
                      background: hasSubs
                        ? 'var(--accent-gold-dim)'
                        : isToday
                          ? 'var(--bg-elevated)'
                          : 'transparent',
                      color: hasSubs
                        ? 'var(--accent-gold)'
                        : isToday
                          ? 'var(--text-primary)'
                          : 'var(--text-dim)',
                      border: isToday
                        ? '1px solid var(--border-accent)'
                        : hasSubs
                          ? '1px solid var(--accent-gold-dim)'
                          : '1px solid transparent',
                    }}
                  >
                    {day.dayNum}
                  </div>
                  {/* Dots for subscriptions */}
                  <div
                    style={{
                      display: 'flex',
                      gap: '2px',
                      height: '6px',
                    }}
                  >
                    {day.subs.map((_, si) => (
                      <div
                        key={si}
                        style={{
                          width: '4px',
                          height: '4px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--accent-gold)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Renewal list summary */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {calendarDays
              .filter((d) => d.subs.length > 0)
              .map((day, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        minWidth: '48px',
                      }}
                    >
                      {day.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      {day.subs.map((s) => (
                        <span
                          key={s.id}
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '12px',
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-elevated)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          {s.logo} {s.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      flexShrink: 0,
                    }}
                  >
                    {formatCurrency(
                      day.subs.reduce((sum, s) => sum + s.amount, 0)
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </motion.div>

      {/* ── Tetris Block Preview ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <LayoutGrid size={18} style={{ color: 'var(--accent-violet)' }} />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Subscription Footprint
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginLeft: '4px',
            }}
          >
            relative to ${MONTHLY_INCOME.toLocaleString()} monthly income
          </span>
        </div>
        <div style={{ ...cardStyle, padding: '24px' }}>
          {/* Income container bar */}
          <div
            style={{
              position: 'relative',
              height: '48px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              marginBottom: '16px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Filled portion */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(totalPercentOfIncome, 100)}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
              style={{
                height: '100%',
                display: 'flex',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}
            >
              {tetrisBlocks.map((block, i) => {
                const colors = [
                  'var(--accent-violet)',
                  'var(--accent-rose)',
                  'var(--accent-sky)',
                  'var(--accent-emerald)',
                  'var(--accent-gold)',
                  'var(--accent-orange)',
                ];
                const color = colors[i % colors.length];
                const widthInFilled =
                  (block.amount / totalMonthly) * 100;
                return (
                  <div
                    key={block.id}
                    title={`${block.name}: ${formatCurrency(block.amount)}`}
                    style={{
                      width: `${widthInFilled}%`,
                      height: '100%',
                      background: color,
                      opacity: 0.8,
                      transition: 'opacity 0.2s',
                      borderRight:
                        i < tetrisBlocks.length - 1
                          ? '1px solid var(--bg-deep)'
                          : 'none',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.opacity = '0.8';
                    }}
                  />
                );
              })}
            </motion.div>

            {/* Label overlay */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                right: '12px',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {totalPercentOfIncome.toFixed(1)}% of income
            </div>
          </div>

          {/* Tetris legend grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '8px',
            }}
          >
            {tetrisBlocks.map((block, i) => {
              const colors = [
                'var(--accent-violet)',
                'var(--accent-rose)',
                'var(--accent-sky)',
                'var(--accent-emerald)',
                'var(--accent-gold)',
                'var(--accent-orange)',
              ];
              const color = colors[i % colors.length];
              return (
                <div
                  key={block.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                  }}
                >
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '2px',
                      background: color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {block.logo} {block.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-dim)',
                      flexShrink: 0,
                    }}
                  >
                    {block.percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Remaining capacity */}
          <div
            style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'var(--text-dim)',
              }}
            >
              Remaining income after subscriptions
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--accent-emerald)',
              }}
            >
              {formatCurrency(MONTHLY_INCOME - totalMonthly)}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
