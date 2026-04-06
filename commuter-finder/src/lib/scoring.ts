import { Location, ScoreResult, Affordability } from './types';

// Tweak these weights to change how locations are ranked.
// They must sum to 100.
export const SCORE_WEIGHTS = {
  commute:       30, // Fast, frequent service to the right terminal
  affordability: 25, // Buying power vs local house prices
  crime:         15, // Safety — overall + burglary + LGBT+ risk
  lifestyle:     30, // Character (×2), dog walking, dining, shopping — all subjective ratings
} as const; // total: 100

export function getBudget(salary: number, deposit: number): number {
  return salary * 4.5 + deposit;
}

export function getAffordability(loc: Location, salary: number, deposit: number): Affordability {
  const budget = getBudget(salary, deposit);
  const mid = (loc.costs.buyLow + loc.costs.buyHigh) / 2;
  if (mid <= budget * 0.96) return 'comfortable';
  if (loc.costs.buyLow <= budget) return 'tight';
  return 'over';
}

export function calculateScore(loc: Location, salary: number, deposit: number, terminal: string): ScoreResult {
  const termMatch = terminal === 'any' || loc.commute.terminal === terminal;

  // 1. Commute (0–30): terminal match + journey time
  let commuteScore: number;
  if (!termMatch) {
    commuteScore = 2;
  } else {
    const t = loc.commute.timeMin;
    if (t <= 25)      commuteScore = 30;
    else if (t <= 30) commuteScore = 26;
    else if (t <= 35) commuteScore = 21;
    else if (t <= 40) commuteScore = 16;
    else if (t <= 47) commuteScore = 10;
    else              commuteScore = 4;
  }

  // 2. Affordability (0–25): ratio of buying power to mid-price, linear scale.
  // 25/25 at ratio >= 1.50 (budget is 50%+ above mid-price).
  // 0/25  at ratio <= 0.65 (budget covers only 65% of mid-price).
  const midPrice = (loc.costs.buyLow + loc.costs.buyHigh) / 2;
  const ratio = getBudget(salary, deposit) / midPrice;
  const affordabilityScore = Math.round(Math.min(25, Math.max(0, (ratio - 0.65) / 0.85 * 25)));

  // 3. Crime (0–15): overall crime rate + burglary + LGBT+ safety
  let crimeScore = 10; // default when no crime data
  if (loc.crime) {
    const o = loc.crime.overallVsNational;
    if (o <= -15)     crimeScore = 15;
    else if (o <= -5) crimeScore = 13;
    else if (o <= 5)  crimeScore = 11;
    else if (o <= 15) crimeScore = 7;
    else              crimeScore = 3;

    const b = loc.crime.burglaryVsNational;
    if (b < -30)      crimeScore = Math.min(15, crimeScore + 2);
    else if (b > 20)  crimeScore = Math.max(0, crimeScore - 2);

    if (loc.crime.lgbtRisk === 'higher')      crimeScore = Math.max(0, crimeScore - 4);
    else if (loc.crime.lgbtRisk === 'similar') crimeScore = Math.max(0, crimeScore - 1);
  }

  // 4. Lifestyle (0–30): weighted average of all four ratings.
  // Character counts double (×2) since it's the most important dimension for us.
  // dogWalking, dining, shopping each ×1. Total weight = 5.
  const ls = loc.lifestyle;
  const lifestyleScore = Math.round(
    ((ls.character * 2 + ls.dogWalking + ls.dining + ls.shopping) / 5 / 5) * SCORE_WEIGHTS.lifestyle
  );

  const total = commuteScore + affordabilityScore + crimeScore + lifestyleScore;
  return {
    total: Math.min(100, Math.max(0, total)),
    components: {
      commute: commuteScore,
      affordability: affordabilityScore,
      crime: crimeScore,
      lifestyle: lifestyleScore,
    },
  };
}

export function getScoreBadgeClass(score: number, isCrossed: boolean): string {
  if (isCrossed) return 'score-dim';
  if (score >= 72) return 'score-high';
  if (score >= 52) return 'score-mid';
  return 'score-low';
}

export function getHeaderScoreColor(score: number): string {
  if (score >= 72) return 'var(--green)';
  if (score >= 52) return 'var(--amber)';
  return 'var(--red)';
}

export function lastTrainRating(departs: string): 'green' | 'amber' | 'red' | null {
  if (!departs) return null;
  const clean = departs.replace('~', '').trim();
  const [h, m] = clean.split(':').map(Number);
  const mins = (h < 6 ? h + 24 : h) * 60 + m;
  if (mins >= 23 * 60 + 30) return 'green';
  if (mins >= 23 * 60) return 'amber';
  return 'red';
}

export interface LastTrainBadge {
  rating: 'green' | 'amber' | 'red';
  isApprox: boolean;
  bg: string;
  color: string;
  label: string;
}

export function getLastTrainBadge(departs: string): LastTrainBadge | null {
  const rating = lastTrainRating(departs);
  if (!rating) return null;
  const isApprox = departs.startsWith('~');
  const colors = { green: 'var(--green-light)', amber: 'var(--amber-light)', red: 'var(--red-light)' };
  const textColors = { green: 'var(--green-text)', amber: 'var(--amber-text)', red: 'var(--red-text)' };
  const labels = { green: 'Late night friendly', amber: 'Leave by ~22:30', red: 'Early finish needed' };
  return { rating, isApprox, bg: colors[rating], color: textColors[rating], label: labels[rating] };
}

export function affClass(a: Affordability): string {
  return { comfortable: 'price-ok', tight: 'price-warn', over: 'price-over' }[a];
}

export function affIcon(a: Affordability): string {
  return { comfortable: '✅', tight: '⚠️', over: '❌' }[a];
}

export function getPipClass(loc: Location, salary: number, deposit: number, terminal: string, crossedOff: string[]): string {
  if (crossedOff.includes(loc.id)) return 'pip-dimmed';
  const aff = getAffordability(loc, salary, deposit);
  if (aff === 'over') return 'pip-red';
  const tm = terminal === 'any' || loc.commute.terminal === terminal;
  if (!tm) return 'pip-slate';
  return aff === 'tight' ? 'pip-amber' : 'pip-green';
}

export function stars(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

export function formatPrice(n: number): string {
  return `£${Math.round(n / 1000)}k`;
}

export function formatSeasonTicket(n: number): string {
  return `~£${(n / 1000).toFixed(1)}k`;
}
