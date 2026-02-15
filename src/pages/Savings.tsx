import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  TrendingUp,
  Zap,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Plus,
  Target,
  Rocket,
  X,
  ArrowUpCircle,
  Calendar,
  Percent,
  CircleDollarSign,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { savingsRules, goals } from '../data/mockData';

const typeIcons: Record<string, React.ReactNode> = {
  roundup: <ArrowUpCircle size={20} />,
  percent: <Percent size={20} />,
  trigger: <Zap size={20} />,
  recurring: <RefreshCw size={20} />,
};

const typeColors: Record<string, string> = {
  roundup: 'var(--accent-emerald)',
  percent: 'var(--accent-violet)',
  trigger: 'var(--accent-orange)',
  recurring: 'var(--accent-sky)',
};

const typeLabels: Record<string, string> = {
  roundup: 'Round-Up',
  percent: 'Percentage',
  trigger: 'Trigger',
  recurring: 'Recurring',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 260, damping: 24 },
  },
};

export default function Savings() {
  const [ruleStates, setRuleStates] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      savingsRules.forEach((r) => {
        initial[r.id] = r.active;
      });
      return initial;
    }
  );
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    type: 'roundup',
    amount: '',
  });

  const totalSaved = useMemo(
    () => savingsRules.reduce((sum, r) => sum + r.totalSaved, 0),
    []
  );

  const activeCount = useMemo(
    () => Object.values(ruleStates).filter(Boolean).length,
    [ruleStates]
  );

  const avgMonthlySavings = useMemo(() => {
    const activeRules = savingsRules.filter((r) => ruleStates[r.id]);
    if (activeRules.length === 0) return 0;
    return activeRules.reduce((sum, r) => {
      if (r.frequency === 'daily') return sum + r.amount * 30;
      if (r.frequency === 'weekly') return sum + r.amount * 4.33;
      if (r.frequency === 'biweekly') return sum + r.amount * 2.17;
      if (r.frequency === 'monthly') return sum + r.amount;
      if (r.frequency === 'per-transaction') return sum + r.amount * 60;
      return sum + r.amount;
    }, 0);
  }, [ruleStates]);

  const toggleRule = (id: string) => {
    setRuleStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.amount) return;
    setNewRule({ name: '', type: 'roundup', amount: '' });
    setShowCreateForm(false);
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const getGoalPercent = (current: number, target: number) =>
    Math.min(Math.round((current / target) * 100), 100);

  const getEstCompletion = (
    current: number,
    target: number,
    deadline: string
  ) => {
    if (current >= target) return 'Complete!';
    if (deadline) {
      const d = new Date(deadline);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    return 'TBD';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: '32px',
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background:
                'linear-gradient(135deg, var(--accent-gold-dim), var(--accent-gold))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={24} style={{ color: 'var(--bg-deep)' }} />
          </div>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Savings Engine
            </h1>
            <p
              style={{
                color: 'var(--text-secondary)',
                fontSize: '14px',
                margin: 0,
                marginTop: '2px',
              }}
            >
              Automate your wealth building
            </p>
          </div>
        </div>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent-gold-dim)',
            borderRadius: 'var(--radius-lg)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Coins size={18} style={{ color: 'var(--accent-gold)' }} />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--accent-gold)',
            }}
          >
            {formatCurrency(totalSaved)}
          </span>
          <span
            style={{
              color: 'var(--text-dim)',
              fontSize: '13px',
            }}
          >
            total saved
          </span>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '36px',
        }}
      >
        {[
          {
            label: 'Total Saved',
            value: formatCurrency(totalSaved),
            icon: <CircleDollarSign size={20} />,
            color: 'var(--accent-gold)',
            dimColor: 'var(--accent-gold-dim)',
          },
          {
            label: 'Active Rules',
            value: `${activeCount}`,
            icon: <Activity size={20} />,
            color: 'var(--accent-emerald)',
            dimColor: 'var(--accent-emerald-dim)',
          },
          {
            label: 'Avg. Monthly Savings',
            value: formatCurrency(avgMonthlySavings),
            icon: <TrendingUp size={20} />,
            color: 'var(--accent-violet)',
            dimColor: 'var(--accent-violet)',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -2, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: stat.dimColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--text-dim)',
                  marginTop: '2px',
                }}
              >
                {stat.label}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Savings Rules */}
      <motion.div variants={itemVariants}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Zap size={18} style={{ color: 'var(--accent-gold)' }} />
          Savings Rules
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {savingsRules.map((rule, i) => {
          const isActive = ruleStates[rule.id] ?? rule.active;
          const color = typeColors[rule.type] || 'var(--accent-gold)';

          return (
            <motion.div
              key={rule.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                background: isActive ? 'var(--bg-card)' : 'var(--bg-primary)',
                border: isActive
                  ? '1px solid var(--accent-gold-dim)'
                  : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                opacity: isActive ? 1 : 0.6,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isActive
                  ? '0 0 20px -4px rgba(255, 200, 60, 0.12)'
                  : 'none',
                transition: 'opacity 0.3s, border-color 0.3s, box-shadow 0.3s',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                  }}
                />
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive
                        ? `${color}22`
                        : 'var(--bg-elevated)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? color : 'var(--text-dim)',
                      transition: 'all 0.3s',
                    }}
                  >
                    {typeIcons[rule.type] || <Coins size={20} />}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        lineHeight: 1.3,
                      }}
                    >
                      {rule.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: isActive ? color : 'var(--text-dim)',
                        fontWeight: 500,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginTop: '2px',
                      }}
                    >
                      {typeLabels[rule.type] || rule.type}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleRule(rule.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: isActive
                      ? 'var(--accent-emerald)'
                      : 'var(--text-dim)',
                    transition: 'color 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={isActive ? 'Deactivate rule' : 'Activate rule'}
                >
                  {isActive ? (
                    <ToggleRight size={28} />
                  ) : (
                    <ToggleLeft size={28} />
                  )}
                </button>
              </div>

              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  margin: '0 0 14px 0',
                  lineHeight: 1.5,
                }}
              >
                {rule.description}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {formatCurrency(rule.amount)}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-dim)',
                    }}
                  >
                    / {rule.frequency}
                  </span>
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-full)',
                  height: '6px',
                  overflow: 'hidden',
                  marginBottom: '8px',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((rule.totalSaved / (rule.totalSaved + 500)) * 100, 100)}%`,
                  }}
                  transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
                  style={{
                    height: '100%',
                    background: isActive
                      ? `linear-gradient(90deg, ${color}, var(--accent-gold))`
                      : 'var(--text-dim)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'background 0.3s',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: isActive ? 'var(--accent-gold)' : 'var(--text-dim)',
                    fontWeight: 600,
                  }}
                >
                  {formatCurrency(rule.totalSaved)} saved
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-dim)',
                  }}
                >
                  {isActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Create New Rule Card */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -3, borderColor: 'var(--accent-gold-dim)' }}
          onClick={() => setShowCreateForm(true)}
          style={{
            background: 'transparent',
            border: '2px dashed var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            cursor: 'pointer',
            transition: 'border-color 0.3s',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: 'var(--accent-gold)',
            }}
          >
            <Plus size={24} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            Create New Rule
          </span>
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-dim)',
              marginTop: '4px',
            }}
          >
            Automate another savings habit
          </span>
        </motion.div>
      </div>

      {/* Goals Section */}
      <motion.div variants={itemVariants}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Target size={18} style={{ color: 'var(--accent-emerald)' }} />
          Savings Goals
        </h2>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {goals.map((goal, i) => {
          const pct = getGoalPercent(goal.current, goal.target);
          const remaining = Math.max(goal.target - goal.current, 0);
          const estDate = getEstCompletion(
            goal.current,
            goal.target,
            goal.deadline
          );

          return (
            <motion.div
              key={goal.id}
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: `linear-gradient(90deg, transparent, ${goal.color}, transparent)`,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      background: `${goal.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {goal.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {goal.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--text-dim)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px',
                      }}
                    >
                      <Calendar size={11} />
                      Est. {estDate}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: goal.color,
                  }}
                >
                  {pct}%
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-full)',
                  height: '8px',
                  overflow: 'hidden',
                  marginBottom: '12px',
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + i * 0.1,
                    ease: 'easeOut',
                  }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${goal.color}88, ${goal.color})`,
                    borderRadius: 'var(--radius-full)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Saved
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {formatCurrency(goal.current)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Target
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {formatCurrency(goal.target)}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-dim)',
                        marginBottom: '2px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Remaining
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: 'var(--accent-rose)',
                      }}
                    >
                      {formatCurrency(remaining)}
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: `${goal.color}18`,
                  border: `1px solid ${goal.color}44`,
                  borderRadius: 'var(--radius-md)',
                  color: goal.color,
                  fontFamily: 'var(--font-display)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${goal.color}30`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = `${goal.color}18`;
                }}
              >
                <Rocket size={14} />
                Boost Savings
                <ChevronRight size={14} />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {/* Create New Rule Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowCreateForm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-accent)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px',
                width: '100%',
                maxWidth: '440px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowCreateForm(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-gold-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                  }}
                >
                  <Plus size={20} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  Create New Rule
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Rule Name
                  </label>
                  <input
                    type="text"
                    value={newRule.name}
                    onChange={(e) =>
                      setNewRule((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Coffee Fund Round-Up"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--border-subtle)';
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Type
                  </label>
                  <select
                    value={newRule.type}
                    onChange={(e) =>
                      setNewRule((prev) => ({ ...prev, type: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      appearance: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--border-subtle)';
                    }}
                  >
                    <option value="roundup">Round-Up</option>
                    <option value="percent">Percentage</option>
                    <option value="recurring">Recurring</option>
                    <option value="trigger">Trigger</option>
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: '6px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    value={newRule.amount}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent-gold)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--border-subtle)';
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRule}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background:
                      'linear-gradient(135deg, var(--accent-gold-dim), var(--accent-gold))',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--bg-deep)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px',
                  }}
                >
                  <Sparkles size={16} />
                  Save Rule
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
