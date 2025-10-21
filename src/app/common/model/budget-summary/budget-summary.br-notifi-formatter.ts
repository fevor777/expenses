import { BudgetSummarySnapshot } from './budget-summary.types';

export interface SummaryFormatterOptions {
  width?: number; // progress bar width
}

export function composeBudgetSummaryMessage(
  summary: BudgetSummarySnapshot,
  opts: SummaryFormatterOptions = {}
) {
  return composeBudgetSummaryMessageList(summary).join('\n');
}

export function composeBudgetSummaryMessageList(
  summary: BudgetSummarySnapshot,
  opts: SummaryFormatterOptions = {}
) {
  const parts = [
    lineToday(summary),
    lineBudget(summary),
    linePeriod(summary),
    lineDailyAverage(summary),
    lineVelocity(summary),
    lineMonthlyIrregular(summary),
    lineExtra(summary),
    lineNonEssential(summary),
    lineMonth(summary),
  ].filter(Boolean);
  return parts;
}

export function trendIconByRatio(ratio: number | undefined): string {
  if (ratio === undefined) return '';
  if (ratio >= 1.4) return '↑';
  if (ratio >= 1.1) return '^';
  if (ratio >= 0.9) return '~';
  if (ratio >= 0.6) return 'v';
  return '↓';
}

const fmt = (n: number | undefined) => {
  if (n === undefined || isNaN(n)) return '0';
  return Math.abs(n - Math.round(n)) < 0.05
    ? Math.round(n).toString()
    : n.toFixed(1);
};

function lineHeader(s: BudgetSummarySnapshot, opts: SummaryFormatterOptions) {
  if (s.percentUsed <= 0) return '';
  const width = opts.width || 7;
  const filled = Math.round((s.percentUsed / 100) * width);
  const bar = '='.repeat(filled) + '-'.repeat(width - filled);
  return `[${bar}] ${s.percentUsed.toFixed(0)}%`;
}
function lineToday(s: BudgetSummarySnapshot) {
  const irr =
    s.todaysTotal !== s.todaysIrregular ? ` (${s.todaysIrregular}€)` : '';
  const icon =
    s.todaysNeedRatio !== undefined && s.needPerDay !== undefined
      ? trendIconByRatio(s.todaysNeedRatio)
      : '';
  const iconPart = icon ? `${icon}` : '';
  const behavior = s.todaysNonEssential ? ` 💸: ${s.todaysNonEssential}€` : '';
  const todaysExpectation = s.todaysExpectation
    ? ` L${fmt(s.todaysExpectation)}`
    : '';
  return `• T: ${s.todaysTotal}€ ${iconPart}${irr}${behavior}${todaysExpectation}`;
}
function lineMonthlyIrregular(s: BudgetSummarySnapshot) {
  const prog = s.progressPct !== undefined ? s.progressPct.toFixed(0) : '';
  const exhaustion = s.budgetExhaustion ? ' ' + s.budgetExhaustion : '';
  return `• Б: ${s.percentUsed.toFixed(0)}% П: ${prog}%${exhaustion}`;
}
function lineBudget(s: BudgetSummarySnapshot) {
  if (!s.budget) return '';
  const spentStr = `${fmt(s.periodIrregular)}/${fmt(s.budget)}€`;
  const remainingStr = fmt(s.remaining);
  return `• ${spentStr} ◦ ${remainingStr}`;
}

function linePeriod(s: BudgetSummarySnapshot) {
  if (!s.budget) return '';
  const daysPassed = s.meta?.daysPassed ?? 0;
  const frameDays = s.meta?.frameDays ?? 0;
  const daysLeftStr = fmt(s.daysLeft);
  return `• ${daysPassed}/${frameDays}d ◦ ${daysLeftStr}`;
}


function lineDailyAverage(s: BudgetSummarySnapshot) {
  const avgStr = fmt(s.dailyAverage);
  const plan =
    s.budgetPerDay && s.budgetPerDay > 0 ? `п${fmt(s.budgetPerDay)}` : '';
  const need =
    s.needPerDay && s.needPerDay < s.budgetPerDay ? `н${fmt(s.needPerDay)}` : '';
  const extras = [plan, need].filter(Boolean).join(' ');
  const pace = extras ? `Темп: ${avgStr} (${extras})` : `Темп: ${avgStr}`;
  return `• ${pace}`;
}
function lineVelocity(s: BudgetSummarySnapshot) {
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
function lineMonth(s: BudgetSummarySnapshot) {
  return `• Период: ${s.frameTotal}€`;
}
function percentLine(v?: number) {
  return v !== undefined ? ` (${v.toFixed(0)}%)` : '';
}
function daysLine(v?: number) {
  return v !== undefined && v >= 0 ? ` d${v}` : '';
}
function lineExtra(s: BudgetSummarySnapshot) {
  return `• Экстра: ${s.extra}€${percentLine(s.extraPct)}${daysLine(s.daysSinceExtra)}${s.extraSpike ? ' ⚠️' : ''}`;
}
function lineNonEssential(s: BudgetSummarySnapshot) {
  return `• Хотелки: ${s.nonEssential}€${percentLine(s.nonEssentialPct)}${daysLine(s.daysSinceNonEssential)}${s.nonEssentialSpike ? ' ⚠️' : ''}`;
}
