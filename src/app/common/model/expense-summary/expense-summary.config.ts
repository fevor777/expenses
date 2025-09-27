import { SummaryBuildConfig } from './expense-summary.types';

export const DEFAULT_SUMMARY_CONFIG: SummaryBuildConfig = {
  spikeMultiplier: 2,
  velocity: { warn: 1.0, alert: 1.2 },
  energyWeights: { extraPct: 4, velocityState: 2, spike: 1 },
};
