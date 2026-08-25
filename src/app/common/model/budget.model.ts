export type BudgetLimitType = 'category' | 'tag';

export type BudgetLimitRule = {
  id: string;
  type: BudgetLimitType;
  targetId: string;
  value: number;
};

export type BudgetLimitSummary = {
  id: string;
  type: BudgetLimitType;
  targetId: string;
  targetLabel: string;
  orphaned: boolean;
  budget: number;
  spent: number;
  remaining: number;
  rawRemaining: number;
  percentUsed: number;
  periodProgress: number;
  expenseCount: number;
  exceeded: boolean;
};

export const DEFAULT_BUDGET_VALUE = 600;
export const DEFAULT_BUDGET_PERIOD = 30;

export class Budget {
  uid?: string;
  value: number;
  period: number;
  /**
   * Start-of-period timestamp (ms since epoch, start-of-day local time).
   */
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
  limits?: BudgetLimitRule[];
}

type BudgetInput = Omit<Partial<Budget>, 'limits'> & {
  limits?: readonly Partial<BudgetLimitRule>[] | null;
};

export function buildBudgetLimitId(
  type: BudgetLimitType,
  targetId: string
): string {
  return `${type}:${targetId.trim()}`;
}

export function roundBudgetCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizeBudgetLimits(
  limits?: readonly Partial<BudgetLimitRule>[] | null
): BudgetLimitRule[] | undefined {
  if (!Array.isArray(limits) || limits.length === 0) {
    return undefined;
  }

  const seenKeys = new Set<string>();
  const normalized: BudgetLimitRule[] = [];

  for (const limit of limits) {
    const type = normalizeBudgetLimitType(limit?.type);
    const targetId = normalizeBudgetTargetId(limit?.targetId);
    const value = normalizeBudgetLimitValue(limit?.value);

    if (!type || !targetId || value === undefined) {
      continue;
    }

    const dedupeKey = `${type}:${targetId}`;
    if (seenKeys.has(dedupeKey)) {
      continue;
    }

    seenKeys.add(dedupeKey);
    normalized.push({
      id: buildBudgetLimitId(type, targetId),
      type,
      targetId,
      value,
    });
  }

  normalized.sort((left, right) => {
    const typeCmp =
      budgetLimitTypeOrder(left.type) - budgetLimitTypeOrder(right.type);
    if (typeCmp !== 0) {
      return typeCmp;
    }

    return left.targetId.localeCompare(right.targetId);
  });

  return normalized.length > 0 ? normalized : undefined;
}

export function canonicalizeBudget(
  budget?: BudgetInput | null,
  browserTimezone?: string
): Budget {
  const timezone = budget?.timezone?.trim() || browserTimezone || undefined;
  const limits = normalizeBudgetLimits(budget?.limits);

  return {
    ...(budget?.uid ? { uid: budget.uid } : {}),
    value:
      typeof budget?.value === 'number' && Number.isFinite(budget.value)
        ? roundBudgetCurrency(budget.value)
        : DEFAULT_BUDGET_VALUE,
    period:
      typeof budget?.period === 'number' &&
      Number.isFinite(budget.period) &&
      budget.period > 0
        ? Math.trunc(budget.period)
        : DEFAULT_BUDGET_PERIOD,
    ...(isFiniteTimestamp(budget?.periodStartTs)
      ? { periodStartTs: Math.trunc(budget!.periodStartTs!) }
      : {}),
    ...(timezone ? { timezone } : {}),
    ...(typeof budget?.minDayLimit === 'number' &&
    Number.isFinite(budget.minDayLimit)
      ? { minDayLimit: roundBudgetCurrency(budget.minDayLimit) }
      : {}),
    ...(limits ? { limits } : {}),
  };
}

function normalizeBudgetLimitType(
  value?: BudgetLimitType | string | null
): BudgetLimitType | undefined {
  return value === 'category' || value === 'tag' ? value : undefined;
}

function normalizeBudgetTargetId(value?: string | null): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function normalizeBudgetLimitValue(value?: number | null): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined;
  }

  return roundBudgetCurrency(value);
}

function budgetLimitTypeOrder(type: BudgetLimitType): number {
  return type === 'category' ? 0 : 1;
}

function isFiniteTimestamp(value?: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}
