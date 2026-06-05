import {
  DEFAULT_BUDGET,
  roundCurrency,
  type BudgetDocument,
  type ExpenseDocument,
  isExpenseIncludedInBalance,
} from './models.js';

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
  totalSpend: number;
  irregularSpend: number;
  remainingBudget: number;
  savings: number;
  expenseCount: number;
  irregularExpenseCount: number;
  categoryBreakdown?: CategoryBreakdownItem[];
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
  const periodDays =
    resolvedBudget.period > 0 ? Math.floor(resolvedBudget.period) : 30;
  const start = resolvedBudget.periodStartTs
    ? startOfDay(resolvedBudget.periodStartTs)
    : startOfDay(nowMs - (periodDays - 1) * DAY_MS);
  const finish = endOfDay(start + (periodDays - 1) * DAY_MS);

  return {
    start,
    finish,
    periodDays,
    display: `${formatDayMonth(start)} - ${formatDayMonth(finish)} (${periodDays}d)`,
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

  return {
    frameStart: frame.start,
    frameFinish: frame.finish,
    frameDisplay: frame.display,
    budgetValue: resolvedBudget.value,
    budgetPeriodDays: frame.periodDays,
    totalSpend,
    irregularSpend,
    remainingBudget: roundCurrency(resolvedBudget.value - irregularSpend),
    savings: roundCurrency(savings || 0),
    expenseCount: expenses.length,
    irregularExpenseCount,
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

function formatDayMonth(value: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
}