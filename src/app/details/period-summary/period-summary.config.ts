export interface PeriodNarrativeConfig {
  extraHighPct: number; // e.g. >25% extra share triggers note
  unnecessaryWarnPct: number; // weekly warn lower bound
  unnecessaryHighPct: number; // weekly high threshold
  monthUnnecessaryHighPct: number; // monthly high
  topConcentrationHighPct: number; // month top2 high threshold
  singleCategoryDominantPct: number; // today dominant category threshold
}

export const DEFAULT_PERIOD_NARRATIVE_CONFIG: PeriodNarrativeConfig = {
  extraHighPct: 25,
  unnecessaryWarnPct: 12,
  unnecessaryHighPct: 20,
  monthUnnecessaryHighPct: 15,
  topConcentrationHighPct: 55,
  singleCategoryDominantPct: 60,
};
