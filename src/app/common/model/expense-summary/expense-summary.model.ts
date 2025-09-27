// Lightweight backward-compatible wrapper around new factory-generated snapshot.
// TODO: Remove this file after migrating all imports to use factory & types directly.
import { createExpenseSummary, BuildOptions } from './expense-summary.factory';
import {
  RollingFrameBudget,
  ExpenseSummarySnapshot,
} from './expense-summary.types';

export class ExpenseSummary implements ExpenseSummarySnapshot {
  percentUsed: number;
  budget: number;
  remaining: number;
  progressPct?: number;
  frameTotal: number;
  periodIrregular: number;
  todaysTotal: number;
  todaysIrregular: number;
  todaysNonEssential?: number;
  dailyAverage?: number;
  budgetPerDay?: number;
  needPerDay?: number;
  todaysNeedRatio?: number;
  daysLeft?: number;
  velocityRatio?: number;
  velocityOverrun?: number;
  velocityProjectedTotal?: number;
  energyScore?: number;
  budgetExhaustion?: string;
  extra: number;
  extraPct?: number;
  daysSinceExtra?: number;
  extraSpike?: boolean;
  nonEssential: number;
  nonEssentialPct?: number;
  daysSinceNonEssential?: number;
  nonEssentialSpike?: boolean;
  meta: any;

  constructor(
    rolling: RollingFrameBudget,
    frameStart: number,
    frameFinish: number,
    options?: BuildOptions
  ) {
    const snap = createExpenseSummary(
      rolling,
      frameStart,
      frameFinish,
      options
    );
    Object.assign(this, snap);
  }
}

export { ExpenseSummary as ExpensesSummary };
