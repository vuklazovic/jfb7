import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Flame,
  DollarSign,
  Compass,
  Shield,
  Bell,
  Clock,
  Users,
  Mail,
  ChevronRight,
  Sparkles,
  Target,
  Calendar,
} from 'lucide-react';
import { userProfile, archetypes } from '../data/mockData';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const moneyScriptDescriptions: Record<string, string> = {
  Worship: 'You believe more money would solve most of your problems. This drives ambition but can lead to overspending or risky bets in pursuit of "enough."',
  Avoidance: 'You tend to avoid thinking about money, which can mean missed opportunities but also less financial anxiety day-to-day.',
  Status: 'You associate net worth with self-worth. This can fuel achievement but also lifestyle inflation.',
  Vigilance: 'You are hyper-aware of your finances and always prepared. This builds security but can create anxiety.',
};

const aspirationDescriptions: Record<string, { description: string; strategy: string }> = {
  'Freedom & Flexibility': {
    description: 'You value having options above all else. Financial independence means the power to choose how you spend your time.',
    strategy: 'Your strategy focuses on building liquid savings, reducing fixed obligations, and growing passive income streams so you always have room to pivot.',
  },
  Security: {
    description: 'You want to never worry about money. A solid safety net is your priority.',
    strategy: 'Your strategy prioritizes emergency funds, insurance, and steady debt payoff to build an unshakable foundation.',
  },
  Wealth: {
    description: 'You want your money to grow and compound over time.',
    strategy: 'Your strategy emphasizes investing early, minimizing fees, and letting compound interest work in your favor.',
  },
  Lifestyle: {
    description: 'You want to enjoy life without financial guilt.',
    strategy: 'Your strategy balances conscious spending on what you love with automated savings to keep things sustainable.',
  },
};

const big5Colors = [
  'var(--accent-rose)',
  'var(--accent-sky)',
  'var(--accent-emerald)',
  'var(--accent-violet)',
  'var(--accent-orange)',
];

const big5Icons = [Shield, Clock, Target, Users, DollarSign];

const big5Labels = [
  { key: 'riskOrientation' as const, label: 'Risk Orientation', lowLabel: 'Conservative', highLabel: 'Aggressive' },
  { key: 'timePerspective' as const, label: 'Time Perspective', lowLabel: 'Present-focused', highLabel: 'Future-focused' },
  { key: 'selfEfficacy' as const, label: 'Self-Efficacy', lowLabel: 'Building confidence', highLabel: 'Highly confident' },
  { key: 'socialOrientation' as const, label: 'Social Orientation', lowLabel: 'Independent', highLabel: 'Peer-influenced' },
];

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 48,
        height: 26,
        borderRadius: 'var(--radius-full)',
        background: enabled ? 'var(--accent-emerald)' : 'var(--bg-elevated)',
        border: `1px solid ${enabled ? 'var(--accent-emerald)' : 'var(--border-subtle)'}`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: 20,
          height: 20,
          borderRadius: 'var(--radius-full)',
          background: enabled ? '#fff' : 'var(--text-dim)',
          position: 'absolute',
          top: 2,
          left: 0,
        }}
      />
    </button>
  );
}

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <div
      style={{
        width: '100%',
        height: 8,
        borderRadius: 'var(--radius-full)',
        background: 'var(--bg-elevated)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${width}%` }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
        style={{
          height: '100%',
          borderRadius: 'var(--radius-full)',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          boxShadow: `0 0 12px ${color}44`,
        }}
      />
    </div>
  );
}

export default function Profile() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    coolingOff: true,
    socialProof: false,
    weeklySummary: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const memberDate = new Date(userProfile.memberSince + '-01');
  const memberFormatted = memberDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const userArchetype = archetypes.find((a) => a.name === userProfile.archetype);
  const aspirationInfo = aspirationDescriptions[userProfile.aspiration] || aspirationDescriptions['Freedom & Flexibility'];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        padding: '24px 16px 100px',
        maxWidth: 600,
        margin: '0 auto',
        fontFamily: 'var(--font-body)',
      }}
    >
      {/* ====== Profile Header ====== */}
      <motion.div
        variants={item}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          style={{
            width: 96,
            height: 96,
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-violet) 50%, var(--accent-emerald) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            fontFamily: 'var(--font-display)',
            color: 'var(--bg-deep)',
            fontWeight: 700,
            marginBottom: 16,
            boxShadow: '0 0 40px var(--accent-gold-glow), 0 8px 32px rgba(0,0,0,0.3)',
            position: 'relative',
          }}
        >
          {userProfile.name.charAt(0)}
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '2px solid var(--accent-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {userProfile.archetypeEmoji}
          </div>
        </motion.div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: 'var(--text-primary)',
            margin: '0 0 8px',
            fontWeight: 700,
          }}
        >
          {userProfile.name}
        </h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--accent-gold-dim), transparent)',
            border: '1px solid var(--border-gold)',
            fontSize: 14,
            color: 'var(--accent-gold)',
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          <span>{userProfile.archetypeEmoji}</span>
          <span>{userProfile.archetype}</span>
        </motion.div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 13,
            color: 'var(--text-dim)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={14} />
            Member since {memberFormatted}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--accent-orange)',
              fontWeight: 600,
            }}
          >
            <Flame size={14} />
            {userProfile.streakDays} day streak
          </span>
        </div>
      </motion.div>

      {/* ====== Your Archetype Card ====== */}
      <motion.div
        variants={item}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 28,
          marginBottom: 20,
          border: '1px solid var(--border-gold)',
          boxShadow: '0 0 30px var(--accent-gold-glow), 0 4px 24px rgba(0,0,0,0.2)',
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
            height: 3,
            background: 'linear-gradient(90deg, var(--accent-gold), var(--accent-violet), var(--accent-emerald))',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -60,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gold-glow)',
            opacity: 0.15,
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
            style={{ fontSize: 48, lineHeight: 1 }}
          >
            {userProfile.archetypeEmoji}
          </motion.div>
          <div>
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--accent-gold)',
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              Your Archetype
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                color: 'var(--text-primary)',
                margin: 0,
                fontWeight: 700,
              }}
            >
              {userProfile.archetype}
            </h2>
          </div>
        </div>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: 'var(--text-secondary)',
            margin: '0 0 20px',
          }}
        >
          {userProfile.archetypeDescription}
        </p>

        {userArchetype && (
          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--text-dim)',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Recommended Nudges
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {userArchetype.nudges.map((nudge, i) => {
                const nudgeColors = [
                  'var(--accent-emerald)',
                  'var(--accent-violet)',
                  'var(--accent-sky)',
                  'var(--accent-rose)',
                  'var(--accent-orange)',
                ];
                const color = nudgeColors[i % nudgeColors.length];
                return (
                  <motion.span
                    key={nudge}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                    style={{
                      padding: '5px 14px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 12,
                      fontWeight: 600,
                      color,
                      background: `color-mix(in srgb, ${color} 12%, transparent)`,
                      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
                    }}
                  >
                    {nudge}
                  </motion.span>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ====== Financial Big 5 ====== */}
      <motion.div
        variants={item}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          marginBottom: 20,
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          <Sparkles size={18} style={{ color: 'var(--accent-gold)' }} />
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--text-primary)',
              margin: 0,
              fontWeight: 700,
            }}
          >
            Financial Big 5
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {big5Labels.map((dim, i) => {
            const Icon = big5Icons[i];
            const value = userProfile.financialBig5[dim.key] as number;
            return (
              <motion.div
                key={dim.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={15} style={{ color: big5Colors[i] }} />
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {dim.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: 'var(--font-mono)',
                      color: big5Colors[i],
                    }}
                  >
                    {value}
                  </span>
                </div>
                <AnimatedBar value={value} color={big5Colors[i]} delay={400 + i * 150} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 4,
                    fontSize: 11,
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>{dim.lowLabel}</span>
                  <span>{dim.highLabel}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Money Scripts (special) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <DollarSign size={15} style={{ color: big5Colors[4] }} />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                }}
              >
                Money Script
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: big5Colors[4],
                  background: `color-mix(in srgb, ${big5Colors[4]} 15%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${big5Colors[4]} 30%, transparent)`,
                }}
              >
                {userProfile.financialBig5.moneyScripts}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
                margin: 0,
              }}
            >
              {moneyScriptDescriptions[userProfile.financialBig5.moneyScripts]}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* ====== Your Aspiration ====== */}
      <motion.div
        variants={item}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          marginBottom: 20,
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -30,
            left: -30,
            width: 120,
            height: 120,
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-emerald)',
            opacity: 0.06,
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
          }}
        >
          <Compass size={18} style={{ color: 'var(--accent-emerald)' }} />
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              color: 'var(--text-primary)',
              margin: 0,
              fontWeight: 700,
            }}
          >
            Your Aspiration
          </h3>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--accent-emerald-dim), transparent)',
            border: '1px solid color-mix(in srgb, var(--accent-emerald) 25%, transparent)',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: 'var(--accent-emerald)',
              marginBottom: 4,
            }}
          >
            {userProfile.aspiration}
          </div>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.5,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            {aspirationInfo.description}
          </p>
        </motion.div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}
        >
          <ChevronRight
            size={16}
            style={{ color: 'var(--accent-emerald)', flexShrink: 0, marginTop: 2 }}
          />
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.5,
              color: 'var(--text-dim)',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {aspirationInfo.strategy}
          </p>
        </div>
      </motion.div>

      {/* ====== Key Stats ====== */}
      <motion.div
        variants={item}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: 'Flex Number',
            value: userProfile.flexNumber.toLocaleString(),
            icon: TrendingUp,
            color: 'var(--accent-gold)',
            trending: true,
          },
          {
            label: 'Streak',
            value: `${userProfile.streakDays}d`,
            icon: Flame,
            color: 'var(--accent-orange)',
            trending: false,
          },
          {
            label: 'Monthly Income',
            value: `$${userProfile.monthlyIncome.toLocaleString()}`,
            icon: DollarSign,
            color: 'var(--accent-emerald)',
            trending: false,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 14px',
              border: '1px solid var(--border-subtle)',
              textAlign: 'center',
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
                height: 2,
                background: stat.color,
                opacity: 0.6,
              }}
            />
            <stat.icon
              size={18}
              style={{ color: stat.color, marginBottom: 8 }}
            />
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              {stat.value}
              {stat.trending && (
                <TrendingUp size={14} style={{ color: 'var(--accent-emerald)' }} />
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            >
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ====== All Archetypes Grid ====== */}
      <motion.div variants={item} style={{ marginBottom: 20 }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: 'var(--text-primary)',
            margin: '0 0 16px',
            fontWeight: 700,
          }}
        >
          All Archetypes
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          {archetypes.map((arch, i) => {
            const isUser = arch.name === userProfile.archetype;
            return (
              <motion.div
                key={arch.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.35 }}
                whileHover={{ scale: 1.02, y: -2 }}
                style={{
                  background: isUser
                    ? 'linear-gradient(135deg, var(--bg-card), color-mix(in srgb, var(--accent-gold) 8%, var(--bg-card)))'
                    : 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 16,
                  border: isUser
                    ? '1.5px solid var(--border-gold)'
                    : '1px solid var(--border-subtle)',
                  opacity: isUser ? 1 : 0.7,
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isUser ? '0 0 20px var(--accent-gold-glow)' : 'none',
                  transition: 'opacity 0.3s ease',
                }}
              >
                {isUser && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: 9,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--accent-gold)',
                      background: 'var(--accent-gold-dim)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    You
                  </div>
                )}
                <div style={{ fontSize: 28, marginBottom: 8, lineHeight: 1 }}>{arch.emoji}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: isUser ? 'var(--accent-gold)' : 'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  {arch.name}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.4,
                    color: 'var(--text-dim)',
                  }}
                >
                  {arch.tagline}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ====== Settings Section ====== */}
      <motion.div
        variants={item}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-xl)',
          padding: 24,
          marginBottom: 20,
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: 'var(--text-primary)',
            margin: '0 0 20px',
            fontWeight: 700,
          }}
        >
          Settings
        </h3>

        {[
          {
            key: 'pushNotifications' as const,
            label: 'Push Notifications',
            description: 'Get nudges and alerts on your device',
            icon: Bell,
          },
          {
            key: 'coolingOff' as const,
            label: 'Cooling-Off Period',
            description: '24-hour delay on purchases over $100',
            icon: Clock,
          },
          {
            key: 'socialProof' as const,
            label: 'Social Proof Nudges',
            description: 'See what others in your archetype are doing',
            icon: Users,
          },
          {
            key: 'weeklySummary' as const,
            label: 'Weekly Summary Email',
            description: 'Receive your financial recap every Sunday',
            icon: Mail,
          },
        ].map((setting, i) => (
          <motion.div
            key={setting.key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom:
                i < 3 ? '1px solid color-mix(in srgb, var(--border-subtle) 50%, transparent)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <setting.icon size={16} style={{ color: 'var(--text-secondary)' }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 2,
                  }}
                >
                  {setting.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                  {setting.description}
                </div>
              </div>
            </div>
            <ToggleSwitch
              enabled={settings[setting.key]}
              onToggle={() => toggleSetting(setting.key)}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
