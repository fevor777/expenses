import { ExpenseSummarySnapshot } from './expense-summary.types';

export interface SummaryFormatterOptions {
  width?: number; // progress bar width
}

export function composeSummaryMessage(
  summary: ExpenseSummarySnapshot,
  opts: SummaryFormatterOptions = {}
) {
  const parts = [
    lineHeader(summary, opts),
    lineToday(summary),
    lineBudget(summary),
    lineDailyAverage(summary),
    lineVelocity(summary),
    lineMonthlyIrregular(summary),
    lineExtra(summary),
    lineNonEssential(summary),
    lineMonth(summary),
  ].filter(Boolean);
  return parts.join('\n');
}

export function trendIconByRatio(ratio: number | undefined): string {
  if (ratio === undefined) return '';
  if (ratio >= 1.4) return '↑';
  if (ratio >= 1.1) return '\u2197';
  if (ratio >= 0.9) return '→';
  if (ratio >= 0.6) return '\u2198';
  return '↓';
}

const fmt = (n: number | undefined) => {
  if (n === undefined || isNaN(n)) return '0';
  return Math.abs(n - Math.round(n)) < 0.05
    ? Math.round(n).toString()
    : n.toFixed(1);
};

function lineHeader(s: ExpenseSummarySnapshot, opts: SummaryFormatterOptions) {
  if (s.percentUsed <= 0) return '';
  const width = opts.width || 7;
  const filled = Math.round((s.percentUsed / 100) * width);
  const bar = '='.repeat(filled) + '-'.repeat(width - filled);
  return `[${bar}] ${s.percentUsed.toFixed(0)}%`;
}
function lineToday(s: ExpenseSummarySnapshot) {
  const irr =
    s.todaysTotal !== s.todaysIrregular ? ` (${s.todaysIrregular}€)` : '';
  const icon =
    s.todaysNeedRatio !== undefined && s.needPerDay !== undefined
      ? trendIconByRatio(s.todaysNeedRatio)
      : '';
  const iconPart = icon ? `${icon}` : '';
  const behavior = s.todaysNonEssential ? ` 💸: ${s.todaysNonEssential}€` : '';
  const todaysExpectation = s.todaysExpectation
    ? ` л: ${fmt(s.todaysExpectation)}`
    : '';
  return `• ☀️: ${s.todaysTotal}€ ${iconPart}${irr}${behavior} ${todaysExpectation}`;
}
function lineMonthlyIrregular(s: ExpenseSummarySnapshot) {
  const prog = s.progressPct !== undefined ? s.progressPct.toFixed(0) : '';
  const exhaustion = s.budgetExhaustion ? ' ' + s.budgetExhaustion : '';
  return `• Б: ${s.percentUsed.toFixed(0)}% П: ${prog}%${exhaustion}`;
}
function lineBudget(s: ExpenseSummarySnapshot) {
  if (!s.budget) return '';
  const daysPassed = s.meta?.daysPassed;
  const frameDays = s.meta?.frameDays;
  const inFirstHalf =
    daysPassed !== undefined && frameDays ? daysPassed <= frameDays / 2 : false;
  // First half: emphasize progress (spent) first, show days passed + percent used; hide percent left & days left.
  // Second half: emphasize remaining first, show days left + percent left; hide days passed & percent used after P.
  if (inFirstHalf) {
    return `• P: ${s.periodIrregular}€${
      daysPassed !== undefined ? ' d' + daysPassed : ''
    } ${s.percentUsed.toFixed(0)}% O: ${s.remaining.toFixed(0)}€ Б: ${s.budget}€`;
  }
  return `• O: ${s.remaining.toFixed(0)}€${
    s.daysLeft !== undefined ? ' d' + s.daysLeft : ''
  } ${s.percentLeft.toFixed(0)}% P: ${s.periodIrregular}€ Б: ${s.budget}€`;
}
function lineDailyAverage(s: ExpenseSummarySnapshot) {
  const avgStr = fmt(s.dailyAverage);
  const plan =
    s.budgetPerDay && s.budgetPerDay > 0 ? `п${fmt(s.budgetPerDay)}` : '';
  const need =
    s.needPerDay && s.needPerDay < s.budgetPerDay ? `н${fmt(s.needPerDay)}` : '';
  const extras = [plan, need].filter(Boolean).join(' ');
  const pace = extras ? `Темп: ${avgStr} (${extras})` : `Темп: ${avgStr}`;
  return `• ${pace}`;
}
function lineVelocity(s: ExpenseSummarySnapshot) {
  if (!s.budget || s.budget <= 0) return '• Скорость: ⚡ (нет бюджета)';
  const over = s.velocityOverrun ?? 0;
  const projectedTotal = s.velocityProjectedTotal ?? 0;
  const icon = trendIconByRatio(s.velocityRatio) || '→';
  const overStr =
    over === 0 ? '+0€' : `${over > 0 ? '+' : '-'}${Math.abs(over).toFixed(0)}€`;
  let energy = '';
  if (s.energyScore !== undefined) {
    const sc = s.energyScore;
    let emoji = '😇';
    if (sc >= 9) emoji = '😱';
    else if (sc >= 6) emoji = '😟';
    else if (sc >= 3) emoji = '😐';
    else if (sc >= 1.5) emoji = '🙂';
    energy = ` ${emoji}${sc.toFixed(1)}`;
  }
  return `• Скорость: ${icon} ${overStr} (${projectedTotal.toFixed(0)}€)${energy}`;
}
function lineMonth(s: ExpenseSummarySnapshot) {
  return `• Период: ${s.frameTotal}€`;
}
function percentLine(v?: number) {
  return v !== undefined ? ` (${v.toFixed(0)}%)` : '';
}
function daysLine(v?: number) {
  return v !== undefined && v >= 0 ? ` d${v}` : '';
}
function lineExtra(s: ExpenseSummarySnapshot) {
  return `• Экстра: ${s.extra}€${percentLine(s.extraPct)}${daysLine(s.daysSinceExtra)}${s.extraSpike ? ' ⚠️' : ''}`;
}
function lineNonEssential(s: ExpenseSummarySnapshot) {
  return `• Хотелки: ${s.nonEssential}€${percentLine(s.nonEssentialPct)}${daysLine(s.daysSinceNonEssential)}${s.nonEssentialSpike ? ' ⚠️' : ''}`;
}
