import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, ChevronRight } from 'lucide-react';
import { onboardingQuestions, archetypes } from '../data/mockData';

interface OnboardingProps {
  onComplete: () => void;
}

// Floating geometric shape for background
function FloatingShape({ delay, size, x, y, color, shape }: {
  delay: number; size: number; x: string; y: string; color: string; shape: 'circle' | 'diamond' | 'ring';
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.15, 0.08, 0.15, 0],
        scale: [0.8, 1, 1.1, 1, 0.8],
        y: [0, -30, -10, -40, 0],
        x: [0, 10, -10, 5, 0],
        rotate: shape === 'diamond' ? [0, 45, 90, 135, 180] : [0, 0, 0, 0, 0],
      }}
      transition={{
        duration: 12 + delay * 2,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: shape === 'circle' ? '50%' : shape === 'ring' ? '50%' : '4px',
        background: shape === 'ring' ? 'none' : color,
        border: shape === 'ring' ? `2px solid ${color}` : 'none',
        pointerEvents: 'none',
        filter: 'blur(1px)',
      }}
    />
  );
}

function AnimatedBackground() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      overflow: 'hidden',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      {/* Large moving gradients */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse 80% 50% at 20% 30%, rgba(236,72,153,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 60% 50%, rgba(139,92,246,0.08) 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 40% 70%, rgba(236,72,153,0.06) 0%, transparent 60%)',
            'radial-gradient(ellipse 80% 50% at 20% 30%, rgba(236,72,153,0.08) 0%, transparent 60%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <motion.div
        animate={{
          background: [
            'radial-gradient(ellipse 60% 40% at 80% 70%, rgba(139,92,246,0.06) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 30% 40%, rgba(52,211,153,0.05) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 70% 20%, rgba(236,72,153,0.06) 0%, transparent 50%)',
            'radial-gradient(ellipse 60% 40% at 80% 70%, rgba(139,92,246,0.06) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      />

      {/* Floating shapes */}
      <FloatingShape delay={0} size={60} x="10%" y="20%" color="rgba(236,72,153,0.12)" shape="circle" />
      <FloatingShape delay={2} size={40} x="75%" y="15%" color="rgba(139,92,246,0.15)" shape="diamond" />
      <FloatingShape delay={1} size={80} x="85%" y="60%" color="rgba(236,72,153,0.08)" shape="ring" />
      <FloatingShape delay={3} size={30} x="20%" y="75%" color="rgba(52,211,153,0.12)" shape="circle" />
      <FloatingShape delay={1.5} size={50} x="60%" y="80%" color="rgba(139,92,246,0.1)" shape="ring" />
      <FloatingShape delay={2.5} size={35} x="45%" y="10%" color="rgba(236,72,153,0.1)" shape="diamond" />
      <FloatingShape delay={0.5} size={25} x="90%" y="35%" color="rgba(52,211,153,0.1)" shape="circle" />
      <FloatingShape delay={4} size={45} x="5%" y="50%" color="rgba(139,92,246,0.08)" shape="ring" />
    </div>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
  }),
};

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0); // 0 = welcome, 1-7 = questions, 8 = result
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const [isRevealing, setIsRevealing] = useState(false);

  const totalQuestions = onboardingQuestions.length;

  // Calculate archetype from answers
  const result = useMemo(() => {
    if (answers.length < totalQuestions) return null;

    const riskScore = answers[0] || 50;
    const timeScore = answers[1] || 50;
    const efficacyScore = answers[2] || 50;
    const socialScore = answers[3] || 50;
    const confidenceScore = answers[5] || 50;

    const q5 = onboardingQuestions[4];
    const selectedQ5Index = q5.options.findIndex(o => o.score === answers[4]);
    const moneyScript = (q5.options[selectedQ5Index] as any)?.script || 'Worship';

    const q7 = onboardingQuestions[6];
    const selectedQ7Index = q7.options.findIndex(o => o.score === answers[6]);
    const aspiration = (q7.options[selectedQ7Index] as any)?.aspiration || 'Freedom';

    // Calculate average score (excluding aspiration which is 0)
    const avgScore = (riskScore + timeScore + efficacyScore + socialScore + confidenceScore) / 5;

    // Map to archetype based on profile
    let archetype;
    if (efficacyScore >= 80 && confidenceScore >= 80) {
      archetype = archetypes.find(a => a.name === 'Financial Master')!;
    } else if (efficacyScore <= 20 || confidenceScore <= 15) {
      archetype = archetypes.find(a => a.name === 'Avoider')!;
    } else if (socialScore >= 80) {
      archetype = archetypes.find(a => a.name === 'Social Spender')!;
    } else if (riskScore >= 75 && timeScore < 50) {
      archetype = archetypes.find(a => a.name === 'Impulse Manager')!;
    } else if (confidenceScore >= 60 && timeScore >= 75) {
      archetype = archetypes.find(a => a.name === 'Goal Crusher')!;
    } else if (avgScore >= 55 && efficacyScore >= 55) {
      archetype = archetypes.find(a => a.name === 'Steady Builder')!;
    } else if (confidenceScore < 40 && efficacyScore < 40) {
      archetype = archetypes.find(a => a.name === 'Anxious Checker')!;
    } else {
      archetype = archetypes.find(a => a.name === 'Hopeful Beginner')!;
    }

    return {
      archetype,
      scores: {
        'Risk Orientation': riskScore,
        'Time Perspective': timeScore,
        'Self-Efficacy': efficacyScore,
        'Social Influence': socialScore,
        'Financial Confidence': confidenceScore,
      },
      moneyScript,
      aspiration,
    };
  }, [answers, totalQuestions]);

  const handleNext = () => {
    if (currentStep === 0) {
      setDirection(1);
      setCurrentStep(1);
      return;
    }

    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setSelectedOption(null);
    setDirection(1);

    if (currentStep < totalQuestions) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show result
      setIsRevealing(true);
      setCurrentStep(totalQuestions + 1);
    }
  };

  const currentQuestion = currentStep >= 1 && currentStep <= totalQuestions
    ? onboardingQuestions[currentStep - 1]
    : null;

  // Welcome screen
  const renderWelcome = () => (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -200 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{
          position: 'absolute',
          top: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, var(--accent-gold) 0%, #BE185D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.1rem',
          color: 'var(--bg-deep)',
          boxShadow: '0 0 24px rgba(236,72,153,0.3)',
        }}>
          J
        </div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}>
          JFB
        </span>
      </motion.div>

      {/* Center content */}
      <div style={{
        maxWidth: 640,
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 200 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--accent-gold-dim)',
            border: '2px solid var(--accent-gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 40px rgba(236,72,153,0.2), 0 0 80px rgba(236,72,153,0.1)',
          }}
        >
          <Brain size={36} color="var(--accent-gold)" />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}>
            Discover Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--accent-gold), #F472B6, var(--accent-gold))',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Financial DNA
            </span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: 480,
          }}
        >
          Answer 7 quick questions to uncover your unique financial personality.
          We'll use your Financial Big 5 profile to personalize everything -- from insights to nudges.
        </motion.p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          style={{
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { icon: '2 min', label: 'Quick assessment' },
            { icon: '5', label: 'Personality dimensions' },
            { icon: '8', label: 'Unique archetypes' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--accent-gold)',
              }}>{item.icon}</span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}>{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(236,72,153,0.35)' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          style={{
            marginTop: 8,
            padding: '18px 48px',
            background: 'linear-gradient(135deg, var(--accent-gold) 0%, #BE185D 100%)',
            color: 'var(--bg-deep)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.125rem',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 0 24px rgba(236,72,153,0.25), 0 4px 12px rgba(0,0,0,0.3)',
            letterSpacing: '-0.01em',
          }}
        >
          Begin Assessment
          <ArrowRight size={20} strokeWidth={2.5} />
        </motion.button>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.8rem',
            color: 'var(--text-dim)',
            marginTop: -8,
          }}
        >
          Your answers are private and used only to personalize your experience.
        </motion.p>
      </div>
    </motion.div>
  );

  // Question screen
  const renderQuestion = () => {
    if (!currentQuestion) return null;
    const questionIndex = currentStep - 1;

    return (
      <motion.div
        key={`question-${currentStep}`}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '40px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{
          maxWidth: 640,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}>
          {/* Progress bar */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--text-dim)',
              }}>
                {currentStep} of {totalQuestions}
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: 'var(--accent-gold)',
              }}>
                {Math.round((currentStep / totalQuestions) * 100)}%
              </span>
            </div>
            <div style={{
              height: 4,
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: `${((currentStep - 1) / totalQuestions) * 100}%` }}
                animate={{ width: `${(currentStep / totalQuestions) * 100}%` }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--accent-gold), #F472B6)',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 0 12px rgba(236,72,153,0.3)',
                }}
              />
            </div>
          </div>

          {/* Dimension label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              background: 'var(--accent-gold-dim)',
              borderRadius: 'var(--radius-full)',
              alignSelf: 'flex-start',
            }}
          >
            <Sparkles size={14} color="var(--accent-gold)" />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent-gold)',
              letterSpacing: '0.02em',
            }}>
              {currentQuestion.dimension}
            </span>
          </motion.div>

          {/* Question */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 700,
              lineHeight: 1.3,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}
          >
            {currentQuestion.question}
          </motion.h2>

          {/* Option cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedOption === option.score;

              return (
                <motion.button
                  key={`${currentStep}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  whileHover={{ scale: 1.015, borderColor: isSelected ? 'var(--accent-gold)' : 'var(--border-accent)' }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedOption(option.score)}
                  style={{
                    padding: '18px 20px',
                    background: isSelected ? 'var(--accent-gold-dim)' : 'var(--bg-card)',
                    border: `2px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isSelected ? '0 0 20px rgba(236,72,153,0.15)' : 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    width: 24,
                    height: 24,
                    minWidth: 24,
                    borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--accent-gold)' : 'var(--border-accent)'}`,
                    background: isSelected ? 'var(--accent-gold)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}>
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        width="12" height="12" viewBox="0 0 12 12"
                      >
                        <path
                          d="M2 6L5 9L10 3"
                          stroke="var(--bg-deep)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </motion.svg>
                    )}
                  </div>

                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 500 : 400,
                    transition: 'color 0.2s ease',
                  }}>
                    {option.text}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Next button */}
          <AnimatePresence>
            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 8,
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(236,72,153,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  style={{
                    padding: '14px 36px',
                    background: 'linear-gradient(135deg, var(--accent-gold) 0%, #BE185D 100%)',
                    color: 'var(--bg-deep)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 0 16px rgba(236,72,153,0.2), 0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {currentStep === totalQuestions ? 'See My Results' : 'Next'}
                  <ChevronRight size={18} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // Result screen
  const renderResult = () => {
    if (!result) return null;

    const { archetype, scores, moneyScript, aspiration } = result;

    const dimensionColors: Record<string, string> = {
      'Risk Orientation': 'var(--accent-rose)',
      'Time Perspective': 'var(--accent-sky)',
      'Self-Efficacy': 'var(--accent-emerald)',
      'Social Influence': 'var(--accent-violet)',
      'Financial Confidence': 'var(--accent-orange)',
    };

    return (
      <motion.div
        key="result"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '60px 24px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{
          maxWidth: 640,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}>
          {/* Archetype reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: 'spring', stiffness: 200 }}
            style={{ textAlign: 'center' }}
          >
            {/* Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', stiffness: 300 }}
              style={{
                fontSize: '4.5rem',
                marginBottom: 20,
                filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.3))',
              }}
            >
              {archetype.emoji}
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent-gold)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: 8,
              }}
            >
              Your Financial Archetype
            </motion.p>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: 12,
              }}
            >
              {archetype.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: 480,
                margin: '0 auto',
              }}
            >
              {archetype.tagline}
            </motion.p>
          </motion.div>

          {/* Financial Big 5 bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 28px 24px',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 24,
            }}>
              <Brain size={18} color="var(--accent-gold)" />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>
                Your Financial Big 5
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {Object.entries(scores).map(([dimension, score], i) => (
                <motion.div
                  key={dimension}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}>
                      {dimension}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: dimensionColors[dimension] || 'var(--text-dim)',
                      fontWeight: 600,
                    }}>
                      {score}
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 1.6 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        height: '100%',
                        background: `linear-gradient(90deg, ${dimensionColors[dimension] || 'var(--accent-gold)'}, ${dimensionColors[dimension] || 'var(--accent-gold)'}88)`,
                        borderRadius: 'var(--radius-full)',
                        boxShadow: `0 0 12px ${dimensionColors[dimension] || 'var(--accent-gold)'}44`,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Money Script & Aspiration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
            }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}>
                Money Script
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--accent-violet)',
              }}>
                {moneyScript}
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}>
                Core Aspiration
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--accent-emerald)',
              }}>
                {aspiration}
              </p>
            </div>
          </motion.div>

          {/* Recommended nudge types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px 28px',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-dim)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 14,
            }}>
              Recommended Nudge Strategies
            </p>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {archetype.nudges.map((nudge, i) => (
                <motion.span
                  key={nudge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.6 + i * 0.08 }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-gold-dim)',
                    border: '1px solid var(--border-gold)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: 'var(--accent-gold)',
                  }}
                >
                  {nudge}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(236,72,153,0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onComplete}
            style={{
              marginTop: 8,
              padding: '18px 48px',
              background: 'linear-gradient(135deg, var(--accent-gold) 0%, #BE185D 100%)',
              color: 'var(--bg-deep)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.125rem',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 0 24px rgba(236,72,153,0.25), 0 4px 12px rgba(0,0,0,0.3)',
              letterSpacing: '-0.01em',
            }}
          >
            <Sparkles size={20} />
            Start Your Journey
            <ArrowRight size={20} strokeWidth={2.5} />
          </motion.button>
        </div>
      </motion.div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-deep)',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>
      <AnimatedBackground />

      <AnimatePresence mode="wait" custom={direction}>
        {currentStep === 0 && renderWelcome()}
        {currentStep >= 1 && currentStep <= totalQuestions && renderQuestion()}
        {currentStep === totalQuestions + 1 && renderResult()}
      </AnimatePresence>
    </div>
  );
}
