import { PaceMetrics, TimeFrameStats } from './budget-summary.types';

export function computePace(
  spentIrregular: number,
  budget: number,
  frame: TimeFrameStats
): PaceMetrics {
  const remaining = Math.max(budget - spentIrregular, 0);
  const percentUsed = budget
    ? Math.min((spentIrregular / budget) * 100, 100)
    : 0;
  if (budget <= 0) {
    return { remaining, percentUsed };
  }
  const daysPassed = Math.max(frame.daysPassed, 1);
  const currentVelocity = spentIrregular / daysPassed;
  const dailyBudget = budget / frame.daysInFrame;
  const velocityRatio =
    dailyBudget > 0 ? currentVelocity / dailyBudget : undefined;
  const projectedTotal = currentVelocity * frame.daysInFrame;
  const overrun = projectedTotal - budget;
  let velocityState = 0;
  if (velocityRatio !== undefined) {
    if (velocityRatio > 1.2) velocityState = 2;
    else if (velocityRatio > 1.0) velocityState = 1;
  }
  return {
    remaining,
    percentUsed,
    dailyBudget: round(projectedGuard(dailyBudget)),
    currentVelocity: round(projectedGuard(currentVelocity)),
    velocityRatio,
    projectedTotal: round(projectedGuard(projectedTotal)),
    overrun: round(projectedGuard(overrun)),
    velocityState,
  };
}

// computeExhaustionDate + computeExhaustionLabel split: date calculation + formatting
export function computeExhaustionDate(
  spentIrregular: number,
  budget: number,
  frame: TimeFrameStats,
  minDayLimit?: number
): number | undefined {
  if (budget <= 0 || spentIrregular >= budget) return undefined;
  const baselineVelocity = minDayLimit && minDayLimit > 0 ? minDayLimit : 0;
  if (baselineVelocity <= 0) return undefined;
  const remaining = budget - spentIrregular;
  const daysToExhaust = (remaining / baselineVelocity) - 1;
  const exhaustDate = new Date(frame.now.getTime());
  exhaustDate.setDate(exhaustDate.getDate() + Math.ceil(daysToExhaust));
  return exhaustDate.getTime();
}

export function computeExhaustionLabel(exhaustMs?: number): string | undefined {
  if (!exhaustMs) return undefined;
  const d = new Date(exhaustMs);
  const dd = d.getDate().toString().padStart(2, '0');
  const mm = (d.getMonth() + 1).toString().padStart(2, '0');
  return `F: ${dd}.${mm}`;
}
export function computeNeedPerDay(
  spentIrregular: number,
  todaysIrregular: number,
  budget: number,
  frame: TimeFrameStats
): { needPerDay?: number; todaysNeedRatio?: number } {
  if (budget <= 0) return {};
  const daysLeft = frame.daysLeft; // future days
  const daysIncludingToday = daysLeft;
  if (daysIncludingToday <= 0) return {};
  const spentBeforeToday = spentIrregular - todaysIrregular;
  const remainingBeforeToday = budget - spentBeforeToday;
  if (remainingBeforeToday <= 0) return {};
  const baselineNeed = remainingBeforeToday / daysIncludingToday;
  if (todaysIrregular <= baselineNeed) {
    return {
      needPerDay: round(baselineNeed),
      todaysNeedRatio: todaysIrregular / baselineNeed,
    };
  }
  if (daysLeft <= 0) return {};
  const remainingAfterToday = budget - spentIrregular;
  if (remainingAfterToday <= 0) return {};
  const futureNeed = remainingAfterToday / daysLeft;
  return {
    needPerDay: round(futureNeed),
    todaysNeedRatio: todaysIrregular / futureNeed,
  };
}

export function computeExpectPerDay(budgetPerDay: number, needPerDay): number {
  return budgetPerDay < needPerDay ? budgetPerDay : needPerDay;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
function projectedGuard(n: number) {
  return isFinite(n) ? n : 0;
}
