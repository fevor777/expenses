import { Expense } from '../expense.model';
import { ClassificationTotals } from './budget-summary.types';

export interface ClassificationContext {
  startOfToday: number;
}

export function classifyExpenses(
  expenses: Expense[],
  ctx: ClassificationContext
): {
  frameTotal: number;
  periodIrregular: number;
  classification: ClassificationTotals;
} {
  let frameTotal = 0;
  let periodIrregular = 0;
  const classification: ClassificationTotals = {
    extra: 0,
    nonEssential: 0,
    irregular: 0,
    todays: { total: 0, irregular: 0, extra: 0, nonEssential: 0 },
    latest: { extra: undefined, nonEssential: undefined },
  };

  for (const e of expenses) {
    const amt = e.amount || 0;
    frameTotal = roundUp(frameTotal + amt);
    const include = e?.includeInBalance;
    if (include) {
      periodIrregular = roundUp(periodIrregular + amt);
      classification.irregular = periodIrregular;
    }
    const desc = e.description || '';
    const isExtra = desc.includes('!');
    const isNonEss = isExtra || desc.includes('?');
    if (isExtra) {
      classification.extra = roundUp(classification.extra + amt);
      classification.latest.extra = newest(classification.latest.extra, e.date);
    }
    if (isNonEss) {
      classification.nonEssential = roundUp(classification.nonEssential + amt);
      classification.latest.nonEssential = newest(
        classification.latest.nonEssential,
        e.date
      );
    }
    if (e.date >= ctx.startOfToday) {
      classification.todays.total = roundUp(classification.todays.total + amt);
      if (include)
        classification.todays.irregular = roundUp(
          classification.todays.irregular + amt
        );
      if (isExtra)
        classification.todays.extra = roundUp(
          classification.todays.extra + amt
        );
      if (isNonEss)
        classification.todays.nonEssential = roundUp(
          classification.todays.nonEssential + amt
        );
    }
  }

  return { frameTotal, periodIrregular, classification };
}

export function daysSince(
  timestamp?: number,
  now: number = Date.now()
): number | undefined {
  if (timestamp === undefined) return undefined;
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now - timestamp) / msPerDay);
}

export function isSpike(today: number, avg: number, multiplier: number) {
  return today > avg * multiplier && today > 0;
}

export function avgPerDay(total: number, days: number) {
  return days ? total / days : 0;
}

export function roundUp(value: number): number {
  return Math.round(value * 100) / 100;
}

export function newest(current: number | undefined, candidate: number): number {
  if (current === undefined) return candidate;
  return candidate > current ? candidate : current;
}
