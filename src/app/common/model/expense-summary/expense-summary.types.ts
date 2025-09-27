// Core domain types for expense summary (extracted from former monolithic model)
import { Expense } from '../expense.model';

export interface TimeFrameStats {
  daysInFrame: number; // number of days in the active frame
  daysPassed: number;  // inclusive of today
  daysLeft: number;    // days strictly after today
  elapsedPct: number;  // progress % through frame
  now: Date;           // reference clock time
  start: number;       // frame start ms
  finish: number;      // frame finish ms
}

export interface ClassificationTotals {
  extra: number;
  nonEssential: number;
  irregular: number; // equals periodIrregular (spend included in balance)
  todays: {
    total: number;
    irregular: number;
    extra: number;
    nonEssential: number;
  };
  latest: {
    extra?: number;
    nonEssential?: number;
  };
}

export interface BaseMetrics {
  frameTotal: number;
  periodIrregular: number; // alias irregular spend in frame
  classification: ClassificationTotals;
}

export interface BudgetInput { value?: number; period?: number }

export interface RollingFrameBudget {
  expenses: Expense[];
  budget?: BudgetInput;
  dateFrame: { start: { toMillis(): number }; finish: { toMillis(): number } };
}

export interface PaceMetrics {
  remaining: number;
  percentUsed: number;
  dailyBudget?: number;      // plan per day
  currentVelocity?: number;  // actual per-day irregular so far
  velocityRatio?: number;    // currentVelocity / dailyBudget
  projectedTotal?: number;
  overrun?: number;          // projected - budget
  velocityState?: number;    // 0/1/2 tiers
  exhaustionLabel?: string;  // formatted label (e.g., F: dd.mm)
}

export interface NeedMetrics {
  needPerDay?: number;
  todaysNeedRatio?: number;
}

export interface BehavioralMetrics {
  extraPct?: number;
  nonEssentialPct?: number;
  extraSpike?: boolean;
  nonEssentialSpike?: boolean;
  energyScore?: number;
  daysSinceExtra?: number;
  daysSinceNonEssential?: number;
}

export interface ExpenseSummarySnapshot {
  // Budget / progress
  percentUsed: number;
  budget: number;
  remaining: number;
  progressPct?: number;

  // Spending aggregates
  frameTotal: number;
  periodIrregular: number;

  // Today
  todaysTotal: number;
  todaysIrregular: number;
  todaysNonEssential?: number;

  // Pace
  dailyAverage?: number;
  budgetPerDay?: number;
  needPerDay?: number;
  todaysNeedRatio?: number;
  daysLeft?: number;

  // Velocity projections
  velocityRatio?: number;
  velocityOverrun?: number;
  velocityProjectedTotal?: number;
  energyScore?: number;
  budgetExhaustion?: string;

  // Extras
  extra: number;
  extraPct?: number;
  daysSinceExtra?: number;
  extraSpike?: boolean;

  // Non-essential
  nonEssential: number;
  nonEssentialPct?: number;
  daysSinceNonEssential?: number;
  nonEssentialSpike?: boolean;

  meta: {
    dateFrameStart: number;
    dateFrameFinish: number;
    todaysExtra?: number;
    averageDailyExtra?: number;
    averageDailyNonEssential?: number;
    currentVelocity?: number;
    dailyBudget?: number;
    velocityState?: number;
    frameDays?: number;
    daysPassed?: number;
  };
}

export interface SummaryBuildConfig {
  spikeMultiplier: number;
  velocity: { warn: number; alert: number };
  energyWeights: { extraPct: number; velocityState: number; spike: number };
}

export interface Clock { now(): Date }
