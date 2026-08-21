import { DateTime } from 'luxon';
import { Expense } from '../../common/model/expense.model';
import {
  CategoryAggregate,
  PeriodFrameMeta,
  PeriodMetricsSnapshot,
} from './period-summary.types';

export function buildPeriodMetrics(
  frame: PeriodFrameMeta,
  expenses: Expense[],
  categoryNames: ReadonlyMap<string, string>
): PeriodMetricsSnapshot {
  let total = 0;
  let count = expenses.length;
  let regularSum = 0,
    irregularSum = 0,
    regularCount = 0,
    irregularCount = 0;
  let extraSum = 0,
    extraCount = 0,
    unnecessarySum = 0,
    unnecessaryCount = 0;
  const catMap = new Map<string, { sum: number; count: number }>();
  let largest: Expense | undefined;

  const startDay = DateTime.fromMillis(frame.start).startOf('day');
  const finishDay = DateTime.fromMillis(frame.finish).endOf('day');

  expenses.forEach(e => {
    const amount = e.amount || 0;
    total += amount;
    if (!largest || amount > largest.amount) largest = e;
    if (!e.includeInBalance) {
      regularSum += amount;
      regularCount++;
    } else {
      irregularSum += amount;
      irregularCount++;
    }
    const desc = e.description || '';
    const isExtra = desc.includes('!');
    const isUnnecessary = isExtra || desc.includes('?');
    if (isExtra) {
      extraSum += amount;
      extraCount++;
    }
    if (isUnnecessary) {
      unnecessarySum += amount;
      unnecessaryCount++;
    }
    const agg = catMap.get(e.category) || { sum: 0, count: 0 };
    agg.sum += amount;
    agg.count += 1;
    catMap.set(e.category, agg);
  });

  const categories: CategoryAggregate[] = Array.from(catMap.entries())
    .map(([id, v]) => ({
      id,
      name: categoryNames.get(id) || `Unknown category (${id})`,
      amount: round2(v.sum),
      count: v.count,
      percent: total ? (v.sum / total) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  let activeDays: number | undefined;
  let top2Concentration: number | undefined;
  if (frame.mode === 'week' || frame.mode === 'month') {
    const daySet = new Set<string>();
    expenses.forEach(e => daySet.add(DateTime.fromMillis(e.date).toISODate()));
    activeDays = daySet.size;
  }
  if (frame.mode === 'month') {
    const top2 = categories.slice(0, 2).reduce((s, c) => s + c.amount, 0);
    top2Concentration = total ? (top2 / total) * 100 : 0;
  }

  const avg = count ? total / count : 0;
  return {
    frame,
    total: round2(total),
    count,
    avg: round2(avg),
    regularSum: round2(regularSum),
    irregularSum: round2(irregularSum),
    regularCount,
    irregularCount,
    extraSum: round2(extraSum),
    extraCount,
    unnecessarySum: round2(unnecessarySum),
    unnecessaryCount,
    categories,
    largest,
    activeDays,
    top2Concentration,
  };
}

export function round2(v: number): number {
  return Math.round(v * 100) / 100;
}
