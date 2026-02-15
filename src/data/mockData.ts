export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingDate: number;
  category: string;
  logo: string;
  trend: 'up' | 'down' | 'stable';
  lastChange?: number;
}

export interface SavingsRule {
  id: string;
  name: string;
  type: 'roundup' | 'percent' | 'recurring' | 'trigger';
  amount: number;
  frequency: string;
  active: boolean;
  totalSaved: number;
  description: string;
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  balance: number;
  originalBalance: number;
  interestRate: number;
  minimumPayment: number;
  dueDate: number;
  color: string;
}

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  date: string;
  type: 'debit' | 'credit';
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  icon: string;
  color: string;
  deadline: string;
}

export interface CashFlowDay {
  date: string;
  projected: number;
  actual?: number;
  bills: string[];
  income: boolean;
}

export const userProfile = {
  name: 'Jordan',
  archetype: 'Hopeful Beginner',
  archetypeEmoji: '\u2728',
  archetypeDescription: 'You\'re at the start of your financial journey with genuine optimism. You respond well to small wins, visual progress, and community support.',
  financialBig5: {
    riskOrientation: 38,
    timePerspective: 62,
    selfEfficacy: 45,
    socialOrientation: 71,
    moneyScripts: 'Worship',
  },
  aspiration: 'Freedom & Flexibility',
  monthlyIncome: 4800,
  flexNumber: 847,
  flexTrend: 'up' as const,
  streakDays: 12,
  memberSince: '2025-11',
};

export const subscriptions: Subscription[] = [
  { id: '1', name: 'Spotify Premium', amount: 11.99, billingDate: 3, category: 'Entertainment', logo: '\uD83C\uDFB5', trend: 'stable' },
  { id: '2', name: 'Netflix', amount: 22.99, billingDate: 7, category: 'Entertainment', logo: '\uD83C\uDFAC', trend: 'up', lastChange: 3.00 },
  { id: '3', name: 'Adobe Creative Cloud', amount: 59.99, billingDate: 12, category: 'Productivity', logo: '\uD83C\uDFA8', trend: 'stable' },
  { id: '4', name: 'Planet Fitness', amount: 24.99, billingDate: 1, category: 'Health', logo: '\uD83C\uDFCB\uFE0F', trend: 'stable' },
  { id: '5', name: 'iCloud+ 200GB', amount: 2.99, billingDate: 15, category: 'Cloud', logo: '\u2601\uFE0F', trend: 'stable' },
  { id: '6', name: 'Hulu', amount: 17.99, billingDate: 19, category: 'Entertainment', logo: '\uD83D\uDCFA', trend: 'up', lastChange: 2.00 },
  { id: '7', name: 'NYT Digital', amount: 4.00, billingDate: 22, category: 'News', logo: '\uD83D\uDCF0', trend: 'down', lastChange: -13.00 },
  { id: '8', name: 'ChatGPT Plus', amount: 20.00, billingDate: 25, category: 'Productivity', logo: '\uD83E\uDD16', trend: 'stable' },
  { id: '9', name: 'Duolingo Plus', amount: 12.99, billingDate: 8, category: 'Education', logo: '\uD83E\uDD89', trend: 'stable' },
  { id: '10', name: 'Amazon Prime', amount: 14.99, billingDate: 28, category: 'Shopping', logo: '\uD83D\uDCE6', trend: 'stable' },
];

export const savingsRules: SavingsRule[] = [
  { id: '1', name: 'Round-Up Saves', type: 'roundup', amount: 0, frequency: 'Per transaction', active: true, totalSaved: 234.67, description: 'Round every purchase to the nearest dollar and save the change' },
  { id: '2', name: 'Payday 10%', type: 'percent', amount: 10, frequency: 'Bi-weekly', active: true, totalSaved: 1920.00, description: 'Auto-save 10% of every paycheck' },
  { id: '3', name: 'Coffee Guilt Jar', type: 'trigger', amount: 3.00, frequency: 'Per coffee', active: true, totalSaved: 186.00, description: 'Save $3 every time you buy coffee' },
  { id: '4', name: 'Weekly Stash', type: 'recurring', amount: 25.00, frequency: 'Weekly', active: false, totalSaved: 625.00, description: 'Automatic $25 transfer every Friday' },
  { id: '5', name: 'No-Spend Day Bonus', type: 'trigger', amount: 5.00, frequency: 'Per no-spend day', active: true, totalSaved: 340.00, description: 'Reward yourself $5 for every day you don\'t spend' },
];

export const debts: Debt[] = [
  { id: '1', name: 'Student Loan (Federal)', type: 'Student Loan', balance: 18420, originalBalance: 32000, interestRate: 5.5, minimumPayment: 285, dueDate: 15, color: 'var(--accent-violet)' },
  { id: '2', name: 'Chase Sapphire', type: 'Credit Card', balance: 3847, originalBalance: 6200, interestRate: 21.49, minimumPayment: 95, dueDate: 22, color: 'var(--accent-rose)' },
  { id: '3', name: 'Car Loan', type: 'Auto Loan', balance: 11230, originalBalance: 19500, interestRate: 6.9, minimumPayment: 340, dueDate: 5, color: 'var(--accent-sky)' },
  { id: '4', name: 'Best Buy Card', type: 'Credit Card', balance: 680, originalBalance: 1200, interestRate: 25.99, minimumPayment: 25, dueDate: 18, color: 'var(--accent-orange)' },
];

export const goals: Goal[] = [
  { id: '1', name: 'Emergency Fund', target: 5000, current: 3120, icon: '\uD83D\uDEE1\uFE0F', color: 'var(--accent-emerald)', deadline: '2026-06' },
  { id: '2', name: 'Japan Trip', target: 4500, current: 1850, icon: '\u26E9\uFE0F', color: 'var(--accent-rose)', deadline: '2026-10' },
  { id: '3', name: 'New Laptop', target: 2000, current: 875, icon: '\uD83D\uDCBB', color: 'var(--accent-sky)', deadline: '2026-04' },
  { id: '4', name: 'Moving Fund', target: 3000, current: 420, icon: '\uD83C\uDFE0', color: 'var(--accent-violet)', deadline: '2026-12' },
];

export const recentTransactions: Transaction[] = [
  { id: '1', merchant: 'Whole Foods Market', amount: 67.43, category: 'Groceries', date: '2026-02-14', type: 'debit' },
  { id: '2', merchant: 'Shell Gas Station', amount: 48.20, category: 'Transport', date: '2026-02-14', type: 'debit' },
  { id: '3', merchant: 'Employer Direct Deposit', amount: 2400.00, category: 'Income', date: '2026-02-14', type: 'credit' },
  { id: '4', merchant: 'Target', amount: 34.88, category: 'Shopping', date: '2026-02-13', type: 'debit' },
  { id: '5', merchant: 'Chipotle', amount: 14.25, category: 'Dining', date: '2026-02-13', type: 'debit' },
  { id: '6', merchant: 'Uber', amount: 22.50, category: 'Transport', date: '2026-02-12', type: 'debit' },
  { id: '7', merchant: 'Venmo - Alex R.', amount: 45.00, category: 'Transfer', date: '2026-02-12', type: 'credit' },
  { id: '8', merchant: 'Blue Bottle Coffee', amount: 6.50, category: 'Dining', date: '2026-02-12', type: 'debit' },
  { id: '9', merchant: 'Con Edison', amount: 89.44, category: 'Utilities', date: '2026-02-11', type: 'debit' },
  { id: '10', merchant: 'Trader Joe\'s', amount: 52.17, category: 'Groceries', date: '2026-02-10', type: 'debit' },
];

export const budgetCategories = [
  { name: 'Housing', allocated: 1440, spent: 1440, color: 'var(--accent-violet)' },
  { name: 'Groceries', allocated: 400, spent: 312, color: 'var(--accent-emerald)' },
  { name: 'Transport', allocated: 250, spent: 198, color: 'var(--accent-sky)' },
  { name: 'Dining Out', allocated: 200, spent: 187, color: 'var(--accent-rose)' },
  { name: 'Entertainment', allocated: 150, spent: 76, color: 'var(--accent-orange)' },
  { name: 'Shopping', allocated: 150, spent: 134, color: 'var(--accent-gold)' },
  { name: 'Subscriptions', allocated: 193, spent: 193, color: '#A78BFA' },
  { name: 'Savings', allocated: 480, spent: 480, color: 'var(--accent-emerald)' },
];

export const cashFlowForecast: CashFlowDay[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(2026, 1, 15 + i);
  const dayOfMonth = date.getDate();
  const bills: string[] = [];
  let income = false;

  if (dayOfMonth === 1 || dayOfMonth === 15) income = true;
  if (dayOfMonth === 1) bills.push('Rent ($1,440)');
  if (dayOfMonth === 5) bills.push('Car Loan ($340)');
  if (dayOfMonth === 15) bills.push('Student Loan ($285)');
  if (dayOfMonth === 22) bills.push('Credit Card ($95)');

  const baseBalance = 2800;
  const dayVariance = Math.sin(i * 0.3) * 600 + Math.cos(i * 0.1) * 300;
  const trend = i * 8;

  return {
    date: date.toISOString().split('T')[0],
    projected: Math.round(baseBalance + dayVariance + trend),
    actual: i < 5 ? Math.round(baseBalance + dayVariance + trend + (Math.random() - 0.5) * 100) : undefined,
    bills,
    income,
  };
});

export const onboardingQuestions = [
  {
    id: 1,
    dimension: 'Risk Orientation',
    question: 'You unexpectedly receive $5,000. What feels most natural?',
    options: [
      { text: 'Put it all in a high-yield savings account', score: 20 },
      { text: 'Invest most of it in index funds, keep some liquid', score: 50 },
      { text: 'Research individual stocks or crypto opportunities', score: 80 },
      { text: 'Split between paying off debt and investing', score: 60 },
    ],
  },
  {
    id: 2,
    dimension: 'Time Perspective',
    question: 'A friend offers you $500 today or $750 in 6 months. You choose:',
    options: [
      { text: '$500 now \u2014 I have things I need today', score: 25 },
      { text: '$500 now \u2014 who knows what happens in 6 months', score: 35 },
      { text: '$750 later \u2014 that\'s a 50% return', score: 85 },
      { text: 'Depends on what I need the money for right now', score: 55 },
    ],
  },
  {
    id: 3,
    dimension: 'Self-Efficacy',
    question: 'When you think about managing your finances, which is closest to how you feel?',
    options: [
      { text: 'Confident \u2014 I know what I\'m doing, just need better tools', score: 85 },
      { text: 'Capable but inconsistent \u2014 I know what to do but don\'t always follow through', score: 60 },
      { text: 'Overwhelmed \u2014 there\'s so much to figure out', score: 30 },
      { text: 'Avoidant \u2014 I\'d rather not think about it honestly', score: 15 },
    ],
  },
  {
    id: 4,
    dimension: 'Social Orientation',
    question: 'How do your friends influence your spending?',
    options: [
      { text: 'A lot \u2014 I want to keep up and share experiences with them', score: 85 },
      { text: 'Somewhat \u2014 I\'ll join plans but try to set limits', score: 60 },
      { text: 'Rarely \u2014 I make financial decisions independently', score: 30 },
      { text: 'I actually influence my friends to be more careful with money', score: 20 },
    ],
  },
  {
    id: 5,
    dimension: 'Money Scripts',
    question: 'Which statement resonates most with your gut feeling about money?',
    options: [
      { text: '"Money is the root of most problems in relationships"', score: 20, script: 'Avoidance' },
      { text: '"If I just had more money, most of my problems would be solved"', score: 40, script: 'Worship' },
      { text: '"Your success is measured by your financial success"', score: 60, script: 'Status' },
      { text: '"You should always be saving for a rainy day"', score: 80, script: 'Vigilance' },
    ],
  },
  {
    id: 6,
    dimension: 'Confidence Check',
    question: 'If a financial emergency hit tomorrow ($2,000 unexpected expense), how confident are you in handling it?',
    options: [
      { text: 'Very confident \u2014 I have savings for exactly this', score: 90 },
      { text: 'Mostly confident \u2014 I\'d figure it out but it would sting', score: 65 },
      { text: 'Nervous \u2014 I\'d need to use credit or borrow', score: 35 },
      { text: 'Panicked \u2014 I honestly don\'t know what I\'d do', score: 10 },
    ],
  },
  {
    id: 7,
    dimension: 'Aspiration',
    question: 'What does financial success look like to you?',
    options: [
      { text: 'Never worrying about money again \u2014 total security', score: 0, aspiration: 'Security' },
      { text: 'Freedom to quit my job and do anything I want', score: 0, aspiration: 'Freedom' },
      { text: 'Building real wealth that grows over time', score: 0, aspiration: 'Wealth' },
      { text: 'Living my best life without guilt about spending', score: 0, aspiration: 'Lifestyle' },
    ],
  },
];

export const archetypes = [
  { name: 'Hopeful Beginner', emoji: '\u2728', tagline: 'Optimistic, open to learning, building from scratch', nudges: ['Social Proof', 'Gamification', 'Temporal Framing', 'Identity-Based'] },
  { name: 'Anxious Checker', emoji: '\uD83D\uDD0D', tagline: 'Hyper-vigilant, checks frequently, needs reassurance', nudges: ['Loss Aversion', 'Default Effects', 'Identity-Based'] },
  { name: 'Steady Builder', emoji: '\uD83E\uDDF1', tagline: 'Consistent, methodical, protective of progress', nudges: ['Loss Aversion', 'Commitment Devices', 'Default Effects', 'Identity-Based'] },
  { name: 'Goal Crusher', emoji: '\uD83C\uDFAF', tagline: 'Ambitious, progress-driven, loves milestones', nudges: ['Loss Aversion', 'Commitment Devices', 'Gamification', 'Identity-Based'] },
  { name: 'Social Spender', emoji: '\uD83C\uDF89', tagline: 'Peer-influenced, experience-oriented, spontaneous', nudges: ['Social Proof', 'Gamification', 'Temporal Framing'] },
  { name: 'Impulse Manager', emoji: '\u26A1', tagline: 'Quick to act, needs friction points and guardrails', nudges: ['Loss Aversion', 'Social Proof', 'Commitment Devices', 'Gamification', 'Default Effects'] },
  { name: 'Avoider', emoji: '\uD83D\uDE36\u200D\uD83C\uDF2B\uFE0F', tagline: 'Prefers not to engage, needs gentle automation', nudges: ['Default Effects', 'Temporal Framing'] },
  { name: 'Financial Master', emoji: '\uD83D\uDC51', tagline: 'Sophisticated, data-driven, optimization-focused', nudges: ['Commitment Devices', 'Identity-Based'] },
];

export const monthlySpendingTrend = [
  { month: 'Sep', income: 4800, spending: 4200, savings: 600 },
  { month: 'Oct', income: 4800, spending: 4450, savings: 350 },
  { month: 'Nov', income: 4800, spending: 3900, savings: 900 },
  { month: 'Dec', income: 5200, spending: 4800, savings: 400 },
  { month: 'Jan', income: 4800, spending: 4100, savings: 700 },
  { month: 'Feb', income: 4800, spending: 3020, savings: 480 },
];
