import { DEFAULT_SUMMARY_CONFIG } from './expense-summary.config';
import {
  classifyExpenses,
  avgPerDay,
  daysSince,
  isSpike,
  roundUp,
} from './expense-summary.classifier';
import {
  computePace,
  computeExhaustionLabel,
  computeNeedPerDay,
} from './expense-summary.pace';
import { computeEnergyScore } from './expense-summary.energy';
import {
  RollingFrameBudget,
  ExpenseSummarySnapshot,
  Clock,
  SummaryBuildConfig,
  TimeFrameStats,
} from './expense-summary.types';

const realClock: Clock = { now: () => new Date() };

export interface BuildOptions {
  clock?: Clock;
  config?: SummaryBuildConfig;
}

export function createExpenseSummary(
  rolling: RollingFrameBudget,
  frameStart: number,
  frameFinish: number,
  options: BuildOptions = {}
): ExpenseSummarySnapshot {
  // TODO(cents-arithmetic): migrate all currency math to integer cents to avoid FP rounding issues.
  // Strategy: store raw amounts as integer number of cents in classification + pace modules, format only at presentation.
  const clock = options.clock || realClock;
  const config = options.config || DEFAULT_SUMMARY_CONFIG;
  const now = clock.now();
  const frame = computeFrameStats(frameStart, frameFinish, now);

  // Classification pass
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const { frameTotal, periodIrregular, classification } = classifyExpenses(
    rolling.expenses,
    { startOfToday }
  );

  const extraPct = safePct(classification.extra, classification.irregular);
  const nonEssentialPct = safePct(
    classification.nonEssential,
    classification.irregular
  );
  const averageDailyExtra = avgPerDay(
    classification.extra,
    frame.daysPassed || 1
  );
  const averageDailyNonEssential = avgPerDay(
    classification.nonEssential,
    frame.daysPassed || 1
  );
  const extraSpike = isSpike(
    classification.todays.extra,
    averageDailyExtra,
    config.spikeMultiplier
  );
  const nonEssentialSpike = isSpike(
    classification.todays.nonEssential,
    averageDailyNonEssential,
    config.spikeMultiplier
  );

  // Pace & velocity
  const budgetValue = rolling.budget?.value || 0;
  const pace = computePace(periodIrregular, budgetValue, frame);
  const exhaustionLabel = computeExhaustionLabel(
    periodIrregular,
    budgetValue,
    frame
  );
  const need = computeNeedPerDay(
    periodIrregular,
    classification.todays.irregular,
    budgetValue,
    frame
  );
  const dailyAverage =
    periodIrregular > 0
      ? roundUp(periodIrregular / Math.max(frame.daysPassed, 1))
      : 0;
  const spikeFlags = [extraSpike, nonEssentialSpike].filter(Boolean).length;
  const energyScore = computeEnergyScore(
    extraPct,
    pace.velocityState,
    spikeFlags,
    config.energyWeights
  );

  const snapshot: ExpenseSummarySnapshot = {
    percentUsed: pace.percentUsed,
    percentLeft: Math.max(0, 100 - pace.percentUsed),
    budget: budgetValue,
    remaining: pace.remaining,
    progressPct: frame.elapsedPct,
    frameTotal: roundUp(frameTotal),
    periodIrregular: roundUp(periodIrregular),
    todaysTotal: classification.todays.total,
    todaysIrregular: classification.todays.irregular,
    todaysNonEssential: classification.todays.nonEssential || undefined,
    dailyAverage,
    budgetPerDay: pace.dailyBudget,
    needPerDay: need.needPerDay,
    todaysNeedRatio: need.todaysNeedRatio,
    daysLeft: frame.daysLeft,
    velocityRatio: pace.velocityRatio,
    velocityOverrun: pace.overrun,
    velocityProjectedTotal: pace.projectedTotal,
    energyScore,
    budgetExhaustion: exhaustionLabel,
    extra: classification.extra,
    extraPct,
    daysSinceExtra: daysSince(classification.latest.extra),
    extraSpike,
    nonEssential: classification.nonEssential,
    nonEssentialPct,
    daysSinceNonEssential: daysSince(classification.latest.nonEssential),
    nonEssentialSpike,
    meta: {
      dateFrameStart: frame.start,
      dateFrameFinish: frame.finish,
      todaysExtra: classification.todays.extra,
      averageDailyExtra: roundUp(averageDailyExtra),
      averageDailyNonEssential: roundUp(averageDailyNonEssential),
      currentVelocity: pace.currentVelocity,
      dailyBudget: pace.dailyBudget,
      velocityState: pace.velocityState,
      frameDays: frame.daysInFrame,
      daysPassed: frame.daysPassed,
    },
  };

  return snapshot;
}

export function computeFrameStats(
  frameStart: number,
  frameFinish: number,
  now: Date
): TimeFrameStats {
  const startDate = new Date(frameStart);
  const finishDate = new Date(frameFinish);
  const startDay = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  ).getTime();
  const finishDayEnd = new Date(
    finishDate.getFullYear(),
    finishDate.getMonth(),
    finishDate.getDate(),
    23,
    59,
    59,
    999
  ).getTime();
  const totalDays = Math.max(
    1,
    Math.ceil((finishDayEnd - startDay + 1) / (1000 * 60 * 60 * 24))
  );
  const daysPassed = Math.min(
    totalDays,
    Math.max(
      0,
      Math.floor((now.getTime() - startDay) / (1000 * 60 * 60 * 24)) + 1
    )
  );
  const daysLeft = Math.max(totalDays - daysPassed, 0);
  return {
    daysInFrame: totalDays,
    daysPassed,
    daysLeft,
    elapsedPct: (daysPassed / totalDays) * 100,
    now,
    start: frameStart,
    finish: finishDayEnd,
  };
}

function safePct(part: number, whole: number) {
  return whole ? Math.min((part / whole) * 100, 100) : 0;
}
