import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  ShoppingBag,
  Utensils,
  Film,
  Music,
  Gamepad2,
  Plane,
  Clock,
  Target,
  PieChart,
  Scale,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Zap,
  Coffee,
  Ticket,
  Headphones,
  History,
  ToggleLeft,
  ToggleRight,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { userProfile, goals, budgetCategories } from '../data/mockData';

const categories = [
  { value: 'dining', label: 'Dining Out', icon: Utensils },
  { value: 'shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'entertainment', label: 'Entertainment', icon: Film },
  { value: 'music', label: 'Music & Media', icon: Music },
  { value: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'coffee', label: 'Coffee & Drinks', icon: Coffee },
  { value: 'other', label: 'Other', icon: DollarSign },
];

const recentDecisions = [
  { item: 'Nike Air Max 90', amount: 130, category: 'Shopping', verdict: 'MAYBE', date: '2 days ago' },
  { item: 'Sushi dinner for two', amount: 85, category: 'Dining', verdict: 'YES', date: '4 days ago' },
  { item: 'PS5 Game Bundle', amount: 210, category: 'Gaming', verdict: 'NO', date: '1 week ago' },
  { item: 'Spotify Annual Plan', amount: 120, category: 'Music & Media', verdict: 'YES', date: '2 weeks ago' },
];

const equivalents = [
  { label: 'meals out', unitCost: 15, icon: Utensils },
  { label: 'months of Spotify', unitCost: 12, icon: Headphones },
  { label: 'movie tickets', unitCost: 16, icon: Ticket },
  { label: 'fancy coffees', unitCost: 6.5, icon: Coffee },
  { label: 'gallons of gas', unitCost: 3.8, icon: Zap },
];

type Verdict = 'YES' | 'MAYBE' | 'NO';

export default function Afford() {
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('shopping');
  const [showResults, setShowResults] = useState(false);
  const [analyzedAmount, setAnalyzedAmount] = useState<number>(0);
  const [coolingOff, setCoolingOff] = useState(false);
  const [coolingThreshold, setCoolingThreshold] = useState(100);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const flexBudget = userProfile.flexNumber;
  const hourlyRate = userProfile.monthlyIncome / 160;

  const handleAnalyze = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) return;
    setAnalyzedAmount(parsed);
    setShowResults(true);
  };

  const getVerdict = (amt: number): Verdict => {
    if (amt < flexBudget * 0.3) return 'YES';
    if (amt < flexBudget * 0.7) return 'MAYBE';
    return 'NO';
  };

  const verdict = getVerdict(analyzedAmount);

  const verdictConfig: Record<Verdict, { color: string; dim: string; glow: string; icon: React.ReactNode; label: string; subtitle: string }> = {
    YES: {
      color: 'var(--accent-emerald)',
      dim: 'var(--accent-emerald-dim)',
      glow: '0 0 60px var(--accent-emerald), 0 0 120px var(--accent-emerald-dim)',
      icon: <CheckCircle2 size={48} />,
      label: 'You Can Afford This',
      subtitle: 'This fits comfortably within your flex budget.',
    },
    MAYBE: {
      color: 'var(--accent-gold)',
      dim: 'var(--accent-gold-dim)',
      glow: '0 0 60px var(--accent-gold), 0 0 120px var(--accent-gold-dim)',
      icon: <AlertTriangle size={48} />,
      label: 'Think It Over',
      subtitle: 'You can swing it, but it will take a noticeable chunk of your flex budget.',
    },
    NO: {
      color: 'var(--accent-rose)',
      dim: 'var(--accent-rose-dim)',
      glow: '0 0 60px var(--accent-rose), 0 0 120px var(--accent-rose-dim)',
      icon: <XCircle size={48} />,
      label: 'Not Right Now',
      subtitle: 'This would blow past your comfortable spending zone.',
    },
  };

  const workHours = analyzedAmount / hourlyRate;

  const getGoalDelayDays = (goal: typeof goals[0]) => {
    const remaining = goal.target - goal.current;
    if (remaining <= 0) return 0;
    const deadlineDate = new Date(goal.deadline);
    const now = new Date();
    const daysLeft = Math.max(1, Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const dailySavingsRate = remaining / daysLeft;
    if (dailySavingsRate <= 0) return 0;
    return Math.ceil(analyzedAmount / dailySavingsRate);
  };

  const matchedBudgetCategory = budgetCategories.find(
    (bc: any) => bc.name?.toLowerCase().includes(selectedCategory) || selectedCategory.includes(bc.name?.toLowerCase?.() || '')
  ) || budgetCategories[0];

  const budgetSpent = matchedBudgetCategory?.spent ?? 0;
  const budgetAllocated = matchedBudgetCategory?.allocated ?? 500;
  const budgetName = matchedBudgetCategory?.name ?? 'General';
  const budgetPctAfter = Math.min(100, ((budgetSpent + analyzedAmount) / budgetAllocated) * 100);

  const selectedCatObj = categories.find((c) => c.value === selectedCategory)!;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-body)',
        padding: '40px 20px 80px',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 8,
            }}
          >
            Can I Afford This?
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Let the numbers do the talking before your wallet does.
          </p>
        </motion.div>

        {/* Purchase Input Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '48px 32px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: 32,
          }}
        >
          {/* Spotlight gradient */}
          <div
            style={{
              position: 'absolute',
              top: '-60%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '140%',
              height: '120%',
              background: 'radial-gradient(ellipse at center, var(--accent-gold-dim) 0%, transparent 70%)',
              opacity: 0.12,
              pointerEvents: 'none',
            }}
          />

          <label
            style={{
              display: 'block',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              marginBottom: 16,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Enter Purchase Amount
          </label>

          {/* Dollar Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 28,
              gap: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '3.5rem',
                fontWeight: 700,
                color: 'var(--text-dim)',
              }}
            >
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setShowResults(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAnalyze();
              }}
              placeholder="0.00"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '3.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                textAlign: 'center',
                width: '260px',
                caretColor: 'var(--accent-gold)',
              }}
            />
          </div>

          {/* Category Dropdown */}
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              marginBottom: 32,
              minWidth: 220,
            }}
          >
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-body)',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {React.createElement(selectedCatObj.icon, { size: 18 })}
                {selectedCatObj.label}
              </span>
              <ChevronDown
                size={16}
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 6,
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    zIndex: 50,
                    boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setDropdownOpen(false);
                        setShowResults(false);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        width: '100%',
                        padding: '10px 18px',
                        background: selectedCategory === cat.value ? 'var(--bg-card-hover)' : 'transparent',
                        border: 'none',
                        color: selectedCategory === cat.value ? 'var(--accent-gold)' : 'var(--text-primary)',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'var(--font-body)',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-card-hover)';
                      }}
                      onMouseLeave={(e) => {
                        if (selectedCategory !== cat.value) {
                          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                        }
                      }}
                    >
                      {React.createElement(cat.icon, { size: 16 })}
                      {cat.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Analyze Button */}
          <div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAnalyze}
              disabled={!amount || parseFloat(amount) <= 0}
              style={{
                padding: '16px 48px',
                background: !amount || parseFloat(amount) <= 0
                  ? 'var(--bg-elevated)'
                  : 'linear-gradient(135deg, var(--accent-gold), var(--accent-orange))',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                color: !amount || parseFloat(amount) <= 0 ? 'var(--text-dim)' : 'var(--bg-deep)',
                fontSize: '1.1rem',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                cursor: !amount || parseFloat(amount) <= 0 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em',
                boxShadow: !amount || parseFloat(amount) <= 0
                  ? 'none'
                  : '0 4px 24px var(--accent-gold-dim)',
                transition: 'box-shadow 0.3s',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={20} />
                Analyze Purchase
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Results Panel */}
        <AnimatePresence>
          {showResults && analyzedAmount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Verdict */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.35, delay: 0.1 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: `2px solid ${verdictConfig[verdict].color}`,
                  padding: '40px 32px',
                  textAlign: 'center',
                  marginBottom: 24,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    boxShadow: `inset ${verdictConfig[verdict].glow}`,
                    opacity: 0.15,
                    pointerEvents: 'none',
                  }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', bounce: 0.5 }}
                  style={{ color: verdictConfig[verdict].color, marginBottom: 12 }}
                >
                  {verdictConfig[verdict].icon}
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: verdictConfig[verdict].color,
                    marginBottom: 8,
                    textShadow: `0 0 30px ${verdictConfig[verdict].dim}`,
                  }}
                >
                  {verdictConfig[verdict].label}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55 }}
                  style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}
                >
                  {verdictConfig[verdict].subtitle}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65 }}
                  style={{
                    marginTop: 16,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  ${analyzedAmount.toFixed(2)} of ${flexBudget} flex budget ({((analyzedAmount / flexBudget) * 100).toFixed(1)}%)
                </motion.div>
              </motion.div>

              {/* Work Hours Cost */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '28px 28px',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--accent-sky)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    opacity: 0.15,
                    position: 'absolute',
                  }}
                />
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'var(--accent-sky)',
                  }}
                >
                  <Clock size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                    Work Hours Cost
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    This costs you{' '}
                    <span style={{ color: 'var(--accent-sky)' }}>
                      {workHours.toFixed(1)} hours
                    </span>{' '}
                    of work
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                    Based on your ${hourlyRate.toFixed(2)}/hr effective rate (${userProfile.monthlyIncome.toLocaleString()}/mo)
                  </div>
                </div>
              </motion.div>

              {/* Goal Impact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '28px',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                    color: 'var(--accent-violet)',
                  }}
                >
                  <Target size={22} />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    Goal Impact
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {goals.map((goal: any, idx: number) => {
                    const delayDays = getGoalDelayDays(goal);
                    return (
                      <motion.div
                        key={goal.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 + idx * 0.1 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'var(--bg-elevated)',
                          borderRadius: 'var(--radius-lg)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: '1.2rem' }}>{goal.icon}</span>
                          <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{goal.name}</span>
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.85rem',
                            color: delayDays > 7 ? 'var(--accent-rose)' : delayDays > 3 ? 'var(--accent-orange)' : 'var(--accent-emerald)',
                            fontWeight: 600,
                          }}
                        >
                          {delayDays === 0 ? 'No impact' : `delayed by ${delayDays} day${delayDays !== 1 ? 's' : ''}`}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Budget Impact */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '28px',
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                    color: 'var(--accent-orange)',
                  }}
                >
                  <PieChart size={22} />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    Budget Impact
                  </span>
                </div>
                <div
                  style={{
                    padding: '16px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 12,
                    }}
                  >
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{budgetName}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      ${budgetSpent} + ${analyzedAmount.toFixed(0)} / ${budgetAllocated}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 10,
                      background: 'var(--bg-deep)',
                      borderRadius: 'var(--radius-full)',
                      overflow: 'hidden',
                      marginBottom: 10,
                      position: 'relative',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (budgetSpent / budgetAllocated) * 100)}%` }}
                      transition={{ delay: 0.85, duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: 'var(--accent-gold)',
                        borderRadius: 'var(--radius-full)',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                      }}
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, budgetPctAfter)}%` }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      style={{
                        height: '100%',
                        background: budgetPctAfter > 90 ? 'var(--accent-rose)' : budgetPctAfter > 70 ? 'var(--accent-orange)' : 'var(--accent-gold)',
                        borderRadius: 'var(--radius-full)',
                        opacity: 0.4,
                        position: 'absolute',
                        left: 0,
                        top: 0,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    <span>This purchase = {((analyzedAmount / budgetAllocated) * 100).toFixed(1)}% of budget</span>
                    <span
                      style={{
                        color: budgetPctAfter > 100 ? 'var(--accent-rose)' : 'var(--text-secondary)',
                        fontWeight: budgetPctAfter > 100 ? 700 : 400,
                      }}
                    >
                      {budgetPctAfter > 100 ? 'OVER BUDGET' : `${(100 - budgetPctAfter).toFixed(1)}% remaining`}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* What You'd Give Up */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.85, duration: 0.4 }}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-subtle)',
                  padding: '28px',
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                    color: 'var(--accent-gold)',
                  }}
                >
                  <Scale size={22} />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}
                  >
                    What You'd Give Up
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 16,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.1rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  This <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>${analyzedAmount.toFixed(0)}</span> could also be...
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {equivalents.map((eq, idx) => {
                    const count = Math.floor(analyzedAmount / eq.unitCost);
                    if (count < 1) return null;
                    return (
                      <motion.div
                        key={eq.label}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + idx * 0.08 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '10px 16px',
                          background: 'var(--bg-elevated)',
                          borderRadius: 'var(--radius-lg)',
                        }}
                      >
                        <div style={{ color: 'var(--accent-gold-dim)' }}>
                          {React.createElement(eq.icon, { size: 18 })}
                        </div>
                        <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                          <strong style={{ color: 'var(--accent-gold)' }}>{count}</strong> {eq.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cooling-Off Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showResults ? 1.2 : 0.3, duration: 0.4 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: coolingOff ? 20 : 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Timer size={22} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: '1rem' }}>24-Hour Cooling Off</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: 2 }}>
                  Get a reminder before impulse purchases above your threshold
                </div>
              </div>
            </div>
            <button
              onClick={() => setCoolingOff(!coolingOff)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: coolingOff ? 'var(--accent-emerald)' : 'var(--text-dim)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {coolingOff ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
            </button>
          </div>

          <AnimatePresence>
            {coolingOff && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: 'hidden' }}
              >
                <div
                  style={{
                    padding: '20px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 14,
                    }}
                  >
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Trigger threshold</span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--accent-emerald)',
                      }}
                    >
                      ${coolingThreshold}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={25}
                    max={500}
                    step={25}
                    value={coolingThreshold}
                    onChange={(e) => setCoolingThreshold(Number(e.target.value))}
                    style={{
                      width: '100%',
                      accentColor: 'var(--accent-emerald)',
                      cursor: 'pointer',
                      height: 6,
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                      color: 'var(--text-dim)',
                      marginTop: 6,
                    }}
                  >
                    <span>$25</span>
                    <span>$500</span>
                  </div>
                  {analyzedAmount > 0 && analyzedAmount >= coolingThreshold && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        marginTop: 14,
                        padding: '10px 14px',
                        background: 'rgba(255, 180, 50, 0.08)',
                        border: '1px solid var(--accent-gold-dim)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        color: 'var(--accent-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertTriangle size={16} />
                      Your ${analyzedAmount.toFixed(0)} purchase would trigger a 24-hour cooling period.
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recent Decisions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showResults ? 1.35 : 0.45, duration: 0.4 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              color: 'var(--text-secondary)',
            }}
          >
            <History size={20} />
            <span
              style={{
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              Recent Decisions
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentDecisions.map((decision, idx) => {
              const dColor =
                decision.verdict === 'YES'
                  ? 'var(--accent-emerald)'
                  : decision.verdict === 'MAYBE'
                  ? 'var(--accent-gold)'
                  : 'var(--accent-rose)';
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (showResults ? 1.45 : 0.55) + idx * 0.08 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {decision.item}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {decision.category} &middot; {decision.date}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
                      }}
                    >
                      ${decision.amount}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: dColor,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: `${dColor}18`,
                        border: `1px solid ${dColor}40`,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {decision.verdict}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
