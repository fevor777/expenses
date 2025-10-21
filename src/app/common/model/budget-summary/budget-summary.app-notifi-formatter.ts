// Application (in-app toast) budget info message formatter.
// Rich, multi-line variant including all metrics (broader than browser notification).
// The browser notification uses `composeSummaryMessage` (short form). Here we provide
// readable labels and groupings. Can be extended for i18n later.

import { BudgetSummarySnapshot } from './budget-summary.types';
import { trendIconByRatio } from './budget-summary.br-notifi-formatter';

export interface AppBudgetMessageOptions {
  mode?: 'full' | 'basic'; // basic = condensed subset
  barWidth?: number; // progress bar width (default 7 like browser)
  showComparison?: boolean; // include percent vs time line
}

// Number formatting helpers --------------------------------------------------
function fmtMoney(
  n: number | undefined,
  opts: { decimals?: number } = {}
): string {
  if (n === undefined || n === null || isNaN(n)) return '0';
  const d = opts.decimals ?? (Math.abs(n - Math.round(n)) < 0.05 ? 0 : 1);
  return n.toFixed(d).replace(/\.0$/, '');
}
function fmtPct(n: number | undefined, decimals = 0): string {
  if (n === undefined || isNaN(n)) return '0%';
  return n.toFixed(decimals) + '%';
}
function progressBar(percentUsed: number, width: number): string {
  if (percentUsed <= 0) return '[-------]';
  const filled = Math.min(
    width,
    Math.max(0, Math.round((percentUsed / 100) * width))
  );
  return '[' + '='.repeat(filled) + '-'.repeat(width - filled) + ']';
}

function comparisonAnnotation(spentPct?: number, timePct?: number): string {
  if (spentPct === undefined || timePct === undefined) return '';
  const diff = spentPct - timePct; // positive => spending ahead
  const abs = Math.abs(diff);
  // small dead zone
  if (abs < 2.5) return '(по плану)';
  if (diff > 0) return '(чуть быстрее)';
  return '(чуть медленнее)';
}

// Line builders --------------------------------------------------------------
function lineHeader(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string {
  const bw = opts.barWidth ?? 7;
  const bar = progressBar(s.percentUsed, bw);
  const left =
    s.percentLeft !== undefined
      ? fmtPct(s.percentLeft)
      : fmtPct(100 - s.percentUsed);
  return `${bar} ${fmtPct(s.percentUsed)} (ост ${left})`;
}

function lineToday(s: BudgetSummarySnapshot): string {
  const arrow = trendIconByRatio(s.todaysNeedRatio) || '';
  const total = fmtMoney(s.todaysTotal);
  const irrPart =
    s.todaysIrregular !== s.todaysTotal
      ? ` (${fmtMoney(s.todaysIrregular)}€)`
      : '';
  const nonEss = s.todaysNonEssential
    ? ` 💸 ${fmtMoney(s.todaysNonEssential)}€`
    : '';
  const need = s.todaysExpectation
    ? ` л${fmtMoney(s.todaysExpectation)}€/д`
    : '';
  return `<strong>•</strong> Сегодня: ${arrow ? arrow + ' ' : ''}${total}€${irrPart}${nonEss}${need}`;
}

function lineBudget(s: BudgetSummarySnapshot): string {
  if (!s.budget) return `<strong>•</strong> Бюджет: нет`;
  const spentStr = `${fmtMoney(s.periodIrregular)}/${fmtMoney(s.budget)}€`;
  const remainingStr = fmtMoney(s.remaining);
  const daysPassed = s.meta?.daysPassed ?? 0;
  const frameDays = s.meta?.frameDays ?? 0;
  const daysLeftStr = fmtMoney(s.daysLeft);
  return `<strong>•</strong> ${spentStr} • ${remainingStr} :: ${daysPassed}/${frameDays}d • ${daysLeftStr}`;
}

function linePace(s: BudgetSummarySnapshot): string {
  const avg = fmtMoney(s.dailyAverage) + '€/д';
  const plan = s.budgetPerDay ? ` план ${fmtMoney(s.budgetPerDay)}€/д` : '';
  const need =
    s.needPerDay < s.budgetPerDay ? ` нужно ${fmtMoney(s.needPerDay)}€/д` : '';
  return `<strong>•</strong> Темп: ср ${avg}${plan}${need}`;
}

function lineVelocity(s: BudgetSummarySnapshot): string {
  const arrow = trendIconByRatio(s.velocityRatio) || '→';
  const proj =
    s.velocityProjectedTotal !== undefined
      ? fmtMoney(s.velocityProjectedTotal) + '€'
      : '—';
  const over = s.velocityOverrun !== undefined ? s.velocityOverrun : undefined;
  let overStr = '';
  if (over !== undefined) {
    if (over > 0) overStr = ` (+${fmtMoney(over)}€)`;
    else overStr = ` (−${fmtMoney(Math.abs(over))}€)`;
  }
  const exhaustion = s.budgetExhaustion
    ? ` исчерпание ${s.budgetExhaustion}`
    : '';
  return `<strong>•</strong> Скорость: ${arrow} ${proj} прогноз${overStr}${exhaustion}`;
}

function lineComparison(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string {
  if (!opts.showComparison) return '';
  const ann = comparisonAnnotation(s.percentUsed, s.progressPct);
  return `<strong>•</strong> Сравнение: расход ${fmtPct(s.percentUsed)} vs время ${fmtPct(s.progressPct)} ${ann}`.trim();
}

function lineExtra(s: BudgetSummarySnapshot): string {
  const days =
    s.daysSinceExtra !== undefined
      ? ` последняя ${s.daysSinceExtra}д назад`
      : '';
  const spike = s.extraSpike ? ' ⚠️' : '';
  return `<strong>•</strong> Экстра: ${fmtMoney(s.extra)}€ (${fmtPct(s.extraPct)})${days}${spike}`;
}

function lineNonEssential(s: BudgetSummarySnapshot): string {
  const days =
    s.daysSinceNonEssential !== undefined
      ? ` последняя ${s.daysSinceNonEssential}д назад`
      : '';
  const spike = s.nonEssentialSpike ? ' ⚠️' : '';
  return `<strong>•</strong> Хотелки: ${fmtMoney(s.nonEssential)}€ (${fmtPct(s.nonEssentialPct)})${days}${spike}`;
}

function lineEnergy(s: BudgetSummarySnapshot): string {
  if (s.energyScore === undefined) return '';
  let emoji = '😇';
  const sc = s.energyScore;
  if (sc >= 9) emoji = '😱';
  else if (sc >= 6) emoji = '😟';
  else if (sc >= 3) emoji = '😐';
  else if (sc >= 1.5) emoji = '🙂';
  return `<strong>•</strong> Риск: ${emoji}${sc.toFixed(1)}`;
}

function lineFrameTotal(s: BudgetSummarySnapshot): string {
  const passed = s.meta?.daysPassed ?? 0;
  const frameDays = s.meta?.frameDays ?? 0;
  return `<strong>•</strong> Всего (период): ${fmtMoney(s.frameTotal)}€ (${passed} / ${frameDays} дней)`;
}

// Basic mode (short subset similar to approved example header portion)
function buildBasic(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string {
  return prepareBasicList(s, opts).join('<br>');
}

function buildBasicList(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string[] {
  return prepareBasicList(s, opts);
}

function prepareBasicList(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string[] {
  const lines: string[] = [];
  lines.push(lineHeader(s, opts));
  lines.push(lineToday(s));
  lines.push(lineBudget(s));
  lines.push(lineVelocity(s));
  lines.push(lineExtra(s) + ' · ' + lineNonEssential(s));
  return lines;
}

// Full mode – includes every line approved by user.
function buildFull(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string {
  return prepareFullList(s, opts).join('<br>');
}

function prepareFullList(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string[] {
  const lines: string[] = [];
  lines.push(lineHeader(s, opts));
  lines.push(lineToday(s));
  lines.push(lineBudget(s));
  lines.push(linePace(s));
  lines.push(lineVelocity(s));
  const cmp = lineComparison(s, opts);
  if (cmp) lines.push(cmp);
  lines.push(lineExtra(s));
  lines.push(lineNonEssential(s));
  const energy = lineEnergy(s);
  if (energy) lines.push(energy);
  lines.push(lineFrameTotal(s));
  return lines;
}

function buildFullList(
  s: BudgetSummarySnapshot,
  opts: AppBudgetMessageOptions
): string[] {
  return prepareFullList(s, opts);
}

// Public API -----------------------------------------------------------------
export function composeAppBudgetInfoMessage(
  summary: BudgetSummarySnapshot | undefined,
  options: AppBudgetMessageOptions = {}
): string {
  if (!summary) return '';
  const mode = options.mode || 'full';
  const merged: AppBudgetMessageOptions = {
    barWidth: 7,
    showComparison: true,
    ...options,
    mode,
  };
  return mode === 'basic'
    ? buildBasic(summary, merged)
    : buildFull(summary, merged);
}

export function composeAppBudgetInfoMessageList(
  summary: BudgetSummarySnapshot | undefined,
  options: AppBudgetMessageOptions = {}
): string[] {
  if (!summary) return [];
  const mode = options.mode || 'full';
  const merged: AppBudgetMessageOptions = {
    barWidth: 7,
    showComparison: true,
    ...options,
    mode,
  };
  return mode === 'basic'
    ? buildBasicList(summary, merged)
    : buildFullList(summary, merged);
}

