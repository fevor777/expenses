import {
  DEFAULT_BUDGET,
  roundCurrency,
  type BudgetDocument,
  type ExpenseDocument,
  isExpenseIncludedInBalance,
} from './models.js';
import {
  formatBudgetPeriodLabel,
  getInclusivePeriodEndMs,
  normalizePeriodDays,
} from './budget-period.js';

export type BudgetFrame = {
  start: number;
  finish: number;
  periodDays: number;
  display: string;
};

export type CategoryBreakdownItem = {
  category: string;
  total: number;
  irregularSpend: number;
  count: number;
};

export type MonthlySummary = {
  frameStart: number;
  frameFinish: number;
  frameDisplay: string;
  budgetValue: number;
  budgetPeriodDays: number;
  budgetConfiguredPeriodDays: number;
  budgetConfiguredStartTs?: number;
  daysPassed: number;
  daysLeft: number;
  daysLeftIncludingToday: number;
  totalSpend: number;
  irregularSpend: number;
  budgetedSpend: number;
  budgetCountsIncludeInBalanceOnly: boolean;
  remainingBudget: number;
  recommendedDailyLimit: number;
  savings: number;
  expenseCount: number;
  irregularExpenseCount: number;
  categoryBreakdown?: CategoryBreakdownItem[];
};

export type ExpenseCategoryBreakdownItem = {
  category: string;
  total: number;
  count: number;
};

export type MonthlyExpenseSummary = {
  frameStart: number;
  frameFinish: number;
  frameDisplay: string;
  totalSpend: number;
  expenseCount: number;
  categoryBreakdown?: ExpenseCategoryBreakdownItem[];
};

export function resolveBudget(budget?: BudgetDocument | null): BudgetDocument {
  return {
    ...DEFAULT_BUDGET,
    ...(budget ?? {}),
  };
}

export function buildRollingBudgetFrame(
  budget: BudgetDocument | null | undefined,
  nowMs = Date.now()
): BudgetFrame {
  const resolvedBudget = resolveBudget(budget);
  const periodDays = normalizePeriodDays(resolvedBudget.period);
  const start = resolvedBudget.periodStartTs
    ?? startOfDay(nowMs - (periodDays - 1) * DAY_MS);
  const finish = getInclusivePeriodEndMs(start, periodDays);

  return {
    start,
    finish,
    periodDays,
    display: `${formatBudgetPeriodLabel(
      start,
      periodDays,
      resolvedBudget.timezone
    )} (${periodDays}d)`,
  };
}

export function buildCurrentMonthFrame(nowMs = Date.now()): BudgetFrame {
  const now = new Date(nowMs);
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0).getTime();
  const finish = endOfDay(nowMs);
  const periodDays = now.getDate();

  return {
    start,
    finish,
    periodDays,
    display: `${formatDayMonth(start)} - ${formatDayMonth(finish)} (${periodDays}d)`,
  };
}

export function buildCalendarMonthFrame(year: number, month: number): BudgetFrame {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
  const finish = new Date(year, month, 0, 23, 59, 59, 999).getTime();
  const periodDays = new Date(year, month, 0).getDate();

  return {
    start,
    finish,
    periodDays,
    display: formatMonthDisplay(year, month),
  };
}

export function buildBudgetPeriodFrame(
  budget: BudgetDocument | null | undefined,
  periodOffset = 0,
  nowMs = Date.now()
): BudgetFrame {
  const currentFrame = buildRollingBudgetFrame(budget, nowMs);

  if (periodOffset === 0) {
    return currentFrame;
  }

  const shiftMs = periodOffset * currentFrame.periodDays * DAY_MS;
  const start = currentFrame.start + shiftMs;
  const finish = currentFrame.finish + shiftMs;

  return {
    start,
    finish,
    periodDays: currentFrame.periodDays,
    display: `${formatBudgetPeriodLabel(
      start,
      currentFrame.periodDays,
      budget?.timezone
    )} (${currentFrame.periodDays}d)`,
  };
}

export function summarizeExpenses(
  expenses: ExpenseDocument[],
  budget: BudgetDocument | null | undefined,
  savings: number,
  includeCategoryBreakdown: boolean
): MonthlySummary {
  const resolvedBudget = resolveBudget(budget);
  const frame = buildRollingBudgetFrame(resolvedBudget);
  return summarizeExpensesForFrame(
    expenses,
    resolvedBudget,
    savings,
    frame,
    includeCategoryBreakdown
  );
}

export function summarizeExpensesForFrame(
  expenses: ExpenseDocument[],
  budget: BudgetDocument | null | undefined,
  savings: number,
  frame: BudgetFrame,
  includeCategoryBreakdown: boolean,
  nowMs = Date.now()
): MonthlySummary {
  const resolvedBudget = resolveBudget(budget);
  const frameStats = computeBudgetFrameStats(frame, nowMs);
  let totalSpend = 0;
  let irregularSpend = 0;
  let irregularExpenseCount = 0;
  const categoryTotals = new Map<string, CategoryBreakdownItem>();

  for (const expense of expenses) {
    totalSpend = roundCurrency(totalSpend + (expense.amount || 0));

    if (isExpenseIncludedInBalance(expense)) {
      irregularSpend = roundCurrency(irregularSpend + (expense.amount || 0));
      irregularExpenseCount += 1;
    }

    if (includeCategoryBreakdown) {
      const current = categoryTotals.get(expense.category) ?? {
        category: expense.category,
        total: 0,
        irregularSpend: 0,
        count: 0,
      };

      current.total = roundCurrency(current.total + (expense.amount || 0));
      current.count += 1;

      if (isExpenseIncludedInBalance(expense)) {
        current.irregularSpend = roundCurrency(
          current.irregularSpend + (expense.amount || 0)
        );
      }

      categoryTotals.set(expense.category, current);
    }
  }

  const categoryBreakdown = includeCategoryBreakdown
    ? [...categoryTotals.values()].sort((left, right) => right.total - left.total)
    : undefined;
  const remainingBudget = roundCurrency(resolvedBudget.value - irregularSpend);

  return {
    frameStart: frame.start,
    frameFinish: frame.finish,
    frameDisplay: frame.display,
    budgetValue: resolvedBudget.value,
    budgetPeriodDays: frame.periodDays,
    budgetConfiguredPeriodDays: resolvedBudget.period,
    ...(resolvedBudget.periodStartTs !== undefined
      ? { budgetConfiguredStartTs: resolvedBudget.periodStartTs }
      : {}),
    daysPassed: frameStats.daysPassed,
    daysLeft: frameStats.daysLeft,
    daysLeftIncludingToday: frameStats.daysLeftIncludingToday,
    totalSpend,
    irregularSpend,
    budgetedSpend: irregularSpend,
    budgetCountsIncludeInBalanceOnly: true,
    remainingBudget,
    recommendedDailyLimit:
      frameStats.daysLeftIncludingToday > 0
        ? roundCurrency(
            Math.max(remainingBudget, 0) / frameStats.daysLeftIncludingToday
          )
        : 0,
    savings: roundCurrency(savings || 0),
    expenseCount: expenses.length,
    irregularExpenseCount,
    ...(categoryBreakdown ? { categoryBreakdown } : {}),
  };
}

export function summarizeMonthlyExpenses(
  expenses: ExpenseDocument[],
  frame: BudgetFrame,
  includeCategoryBreakdown: boolean
): MonthlyExpenseSummary {
  let totalSpend = 0;
  const categoryTotals = new Map<string, ExpenseCategoryBreakdownItem>();

  for (const expense of expenses) {
    totalSpend = roundCurrency(totalSpend + (expense.amount || 0));

    if (includeCategoryBreakdown) {
      const current = categoryTotals.get(expense.category) ?? {
        category: expense.category,
        total: 0,
        count: 0,
      };

      current.total = roundCurrency(current.total + (expense.amount || 0));
      current.count += 1;
      categoryTotals.set(expense.category, current);
    }
  }

  const categoryBreakdown = includeCategoryBreakdown
    ? [...categoryTotals.values()].sort((left, right) => right.total - left.total)
    : undefined;

  return {
    frameStart: frame.start,
    frameFinish: frame.finish,
    frameDisplay: frame.display,
    totalSpend,
    expenseCount: expenses.length,
    ...(categoryBreakdown ? { categoryBreakdown } : {}),
  };
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(value: number): number {
  const date = new Date(value);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0
  ).getTime();
}

function endOfDay(value: number): number {
  const date = new Date(value);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  ).getTime();
}

type BudgetFrameStats = {
  daysPassed: number;
  daysLeft: number;
  daysLeftIncludingToday: number;
};

function computeBudgetFrameStats(
  frame: BudgetFrame,
  nowMs: number
): BudgetFrameStats {
  const startDay = startOfDay(frame.start);
  const finishDay = startOfDay(frame.finish);
  const todayDay = startOfDay(nowMs);
  const totalDays = Math.max(1, Math.floor((finishDay - startDay) / DAY_MS) + 1);

  if (todayDay < startDay) {
    return {
      daysPassed: 0,
      daysLeft: totalDays,
      daysLeftIncludingToday: totalDays,
    };
  }

  if (todayDay > finishDay) {
    return {
      daysPassed: totalDays,
      daysLeft: 0,
      daysLeftIncludingToday: 0,
    };
  }

  const daysPassed = Math.min(
    totalDays,
    Math.floor((todayDay - startDay) / DAY_MS) + 1
  );
  const daysLeft = Math.max(totalDays - daysPassed, 0);

  return {
    daysPassed,
    daysLeft,
    daysLeftIncludingToday: daysLeft + 1,
  };
}

function formatDayMonth(value: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}

function formatMonthDisplay(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}
