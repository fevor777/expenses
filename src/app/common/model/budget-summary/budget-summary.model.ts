// Lightweight backward-compatible wrapper around new factory-generated snapshot.
// TODO: Remove this file after migrating all imports to use factory & types directly.
import { createBudgetSummary, BuildOptions } from './budget-summary.factory';
import {
  RollingFrameBudget,
  BudgetSummarySnapshot,
} from './budget-summary.types';

export class BudgetSummary implements BudgetSummarySnapshot {
  percentUsed: number;
  budget: number;
  percentLeft: number;
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
    const snap = createBudgetSummary(
      rolling,
      frameStart,
      frameFinish,
      options
    );
    Object.assign(this, snap);
  }
}
