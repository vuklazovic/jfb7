import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { budgetCategories, userProfile } from '../data/mockData';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

const INCOME = userProfile.monthlyIncome;

const FinancialTetris: React.FC = () => {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const totalAllocated = useMemo(
    () => budgetCategories.reduce((sum, c) => sum + c.allocated, 0),
    []
  );
  const totalSpent = useMemo(
    () => budgetCategories.reduce((sum, c) => sum + c.spent, 0),
    []
  );
  const flexSpace = INCOME - totalAllocated;

  // Blocks ordered bottom-to-top (largest first for visual stability)
  const sortedCategories = useMemo(
    () => [...budgetCategories].sort((a, b) => b.allocated - a.allocated),
    []
  );

  // Scale markers
  const scaleMarks = [0.25, 0.5, 0.75];

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Financial Tetris
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--text-dim)',
              margin: '4px 0 0',
            }}
          >
            Monthly budget container
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            {formatCurrency(INCOME)}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'var(--text-dim)',
              margin: '2px 0 0',
            }}
          >
            monthly income
          </p>
        </div>
      </div>

      {/* Summary pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            flex: 1,
            background: 'var(--bg-deep)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '2px',
            }}
          >
            Spent
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--accent-rose)',
            }}
          >
            {formatCurrency(totalSpent)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            flex: 1,
            background: 'var(--bg-deep)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '2px',
            }}
          >
            Remaining
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--accent-emerald)',
            }}
          >
            {formatCurrency(INCOME - totalSpent)}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            flex: 1,
            background: 'var(--bg-deep)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 12px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '2px',
            }}
          >
            Flex
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--accent-gold)',
            }}
          >
            {formatCurrency(flexSpace)}
          </div>
        </motion.div>
      </div>

      {/* Tetris Container */}
      <div
        style={{
          flex: 1,
          minHeight: '400px',
          background: 'var(--bg-deep)',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Animated gridlines */}
        {scaleMarks.map((pct, i) => (
          <motion.div
            key={`grid-${pct}`}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.35, scaleX: 1 }}
            transition={{
              delay: 0.8 + i * 0.15,
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              position: 'absolute',
              top: `${pct * 100}%`,
              left: 0,
              right: 0,
              height: '1px',
              background: 'var(--border-subtle)',
              transformOrigin: 'left',
              zIndex: 1,
            }}
          />
        ))}

        {/* Scale labels */}
        {scaleMarks.map((pct, i) => (
          <motion.span
            key={`label-${pct}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 0.5, x: 0 }}
            transition={{
              delay: 1.0 + i * 0.15,
              duration: 0.4,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              top: `${pct * 100}%`,
              right: '8px',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-dim)',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            {formatCurrency(INCOME * (1 - pct))}
          </motion.span>
        ))}

        {/* Flex space area */}
        {flexSpace > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            style={{
              height: `${(flexSpace / INCOME) * 100}%`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 3,
            }}
          >
            {/* Animated dashed border */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: '8px',
                right: '8px',
                height: '1px',
                backgroundImage:
                  'repeating-linear-gradient(90deg, var(--border-accent) 0, var(--border-accent) 6px, transparent 6px, transparent 12px)',
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 300, damping: 20 }}
              style={{ textAlign: 'center', padding: '8px' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '10px',
                  color: 'var(--text-dim)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                }}
              >
                Flex Space
              </p>
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, type: 'spring', stiffness: 300, damping: 20 }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--accent-emerald)',
                  margin: '4px 0 0',
                }}
              >
                {formatCurrency(flexSpace)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}

        {/* Budget blocks — stacked bottom-up */}
        {[...sortedCategories].reverse().map((cat, i) => {
          const blockHeight = (cat.allocated / INCOME) * 100;
          const fillPct = Math.min((cat.spent / cat.allocated) * 100, 100);
          const isHovered = hoveredBlock === cat.name;
          const isOverBudget = cat.spent >= cat.allocated;
          const reverseIdx = sortedCategories.length - 1 - i;

          return (
            <motion.div
              key={cat.name}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.15 + reverseIdx * 0.12,
                type: 'spring',
                stiffness: 220,
                damping: 22,
                mass: 0.8,
              }}
              onMouseEnter={() => setHoveredBlock(cat.name)}
              onMouseLeave={() => setHoveredBlock(null)}
              style={{
                height: `${blockHeight}%`,
                position: 'relative',
                transformOrigin: 'bottom',
                overflow: 'hidden',
                zIndex: isHovered ? 10 : 3,
                cursor: 'pointer',
              }}
            >
              {/* Block separator line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'rgba(255,255,255,0.04)',
                  zIndex: 4,
                }}
              />

              {/* Allocated background */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.22 : 0.1,
                }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: cat.color,
                }}
              />

              {/* Spent fill — sweeps left to right */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: fillPct / 100 }}
                transition={{
                  delay: 0.5 + reverseIdx * 0.12,
                  duration: 1.0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '100%',
                  transformOrigin: 'left',
                  background: `linear-gradient(90deg, ${cssColorToRgba(cat.color, 0.35)}, ${cssColorToRgba(cat.color, 0.12)})`,
                }}
              />

              {/* Fill edge glow */}
              <motion.div
                initial={{ opacity: 0, left: '0%' }}
                animate={{
                  opacity: isHovered ? 0.9 : 0.5,
                  left: `${fillPct}%`,
                }}
                transition={{
                  left: {
                    delay: 0.5 + reverseIdx * 0.12,
                    duration: 1.0,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: { duration: 0.25 },
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: cat.color,
                  boxShadow: `0 0 8px ${cssColorToRgba(cat.color, 0.6)}`,
                  zIndex: 5,
                }}
              />

              {/* Label layer */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                  padding: '0 14px',
                  minHeight: '28px',
                }}
              >
                <motion.span
                  animate={{ color: isHovered ? '#fff' : cat.color }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {cat.name}
                </motion.span>

                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 500,
                        color: isOverBudget ? 'var(--accent-rose)' : 'var(--text-secondary)',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {formatCurrency(cat.spent)}
                      <span style={{ color: 'var(--text-dim)' }}>/</span>
                      {formatCurrency(cat.allocated)}
                      {isOverBudget && (
                        <span
                          style={{
                            fontSize: '9px',
                            background: 'var(--accent-rose-dim)',
                            color: 'var(--accent-rose)',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 600,
                          }}
                        >
                          FULL
                        </span>
                      )}
                    </motion.span>
                  )}
                </AnimatePresence>

                {!isHovered && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {Math.round(fillPct)}%
                  </span>
                )}
              </div>

              {/* Hover glow overlay */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(180deg, ${cssColorToRgba(cat.color, 0.06)} 0%, transparent 100%)`,
                  pointerEvents: 'none',
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 14px',
          marginTop: '14px',
        }}
      >
        {sortedCategories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.4 + i * 0.06,
              duration: 0.35,
              ease: 'easeOut',
            }}
            onMouseEnter={() => setHoveredBlock(cat.name)}
            onMouseLeave={() => setHoveredBlock(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              padding: '2px 0',
            }}
          >
            <motion.div
              animate={{
                scale: hoveredBlock === cat.name ? 1.4 : 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '2px',
                background: cat.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '11px',
                color:
                  hoveredBlock === cat.name
                    ? 'var(--text-primary)'
                    : 'var(--text-dim)',
                transition: 'color 0.15s',
              }}
            >
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Convert a CSS variable color reference or hex to rgba.
 * For CSS variables, returns a fallback with the given alpha.
 * For hex values, does proper conversion.
 */
function cssColorToRgba(color: string, alpha: number): string {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Handle var() references — map known variables to their actual colors
  const varMap: Record<string, string> = {
    'var(--accent-violet)': `rgba(139, 92, 246, ${alpha})`,
    'var(--accent-emerald)': `rgba(52, 211, 153, ${alpha})`,
    'var(--accent-sky)': `rgba(56, 189, 248, ${alpha})`,
    'var(--accent-rose)': `rgba(244, 63, 94, ${alpha})`,
    'var(--accent-orange)': `rgba(249, 115, 22, ${alpha})`,
    'var(--accent-gold)': `rgba(236, 72, 153, ${alpha})`,
  };

  return varMap[color] || `rgba(255, 255, 255, ${alpha})`;
}

export default FinancialTetris;
