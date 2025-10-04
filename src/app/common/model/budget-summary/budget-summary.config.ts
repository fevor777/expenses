import { BudgetSummaryBuildConfig } from './budget-summary.types';

export const DEFAULT_BUDGET_SUMMARY_CONFIG: BudgetSummaryBuildConfig = {
  spikeMultiplier: 2,
  velocity: { warn: 1.0, alert: 1.2 },
  energyWeights: { extraPct: 4, velocityState: 2, spike: 1 },
};
