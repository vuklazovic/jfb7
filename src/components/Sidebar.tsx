import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Landmark,
  ShoppingBag,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { userProfile } from '../data/mockData';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/savings', icon: PiggyBank, label: 'Savings' },
  { path: '/debt', icon: Landmark, label: 'Debt Payoff' },
  { path: '/afford', icon: ShoppingBag, label: 'Can I Afford?' },
  { path: '/cashflow', icon: TrendingUp, label: 'Cash Flow' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 260,
        height: '100vh',
        background: 'var(--bg-primary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflow: 'hidden',
      }}
    >
      {/* Logo area */}
      <div style={{
        padding: '28px 24px 20px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-rose))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            color: 'var(--text-inverse)',
            fontWeight: 800,
          }}>
            J
          </div>
          <span>
            JFB
            <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: '0.7rem', marginLeft: 6 }}>beta</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-card)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 3,
                    height: 20,
                    borderRadius: 2,
                    background: 'var(--accent-gold)',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* Flex Number widget */}
      <div style={{
        margin: '0 12px 16px',
        padding: '16px',
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg, var(--accent-gold-dim), var(--accent-gold-glow))',
        border: '1px solid var(--border-gold)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Flex Number
          </span>
          <Zap size={14} color="var(--accent-gold)" />
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.75rem',
          fontWeight: 600,
          color: 'var(--accent-gold)',
          lineHeight: 1,
        }}>
          {userProfile.flexNumber}
        </div>
        <div style={{
          fontSize: '0.7rem',
          color: 'var(--accent-emerald)',
          marginTop: 4,
        }}>
          +23 from last week
        </div>
      </div>

      {/* User area */}
      <NavLink
        to="/profile"
        style={{
          padding: '16px 20px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          textDecoration: 'none',
        }}
      >
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 'var(--radius-full)',
          background: 'linear-gradient(135deg, var(--accent-violet), var(--accent-rose))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'white',
        }}>
          {userProfile.name[0]}
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {userProfile.name}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            {userProfile.archetypeEmoji} {userProfile.archetype}
          </div>
        </div>
      </NavLink>
    </motion.aside>
  );
}
