export type StatisticsPanelId =
  | 'analytics'
  | 'categoryFilters'
  | 'multiChart'
  | 'irregularSummary';

export type StatisticsDefaultExpandedPanel = StatisticsPanelId | 'none';

export const STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY =
  'statisticsDefaultExpandedPanel';

export const STATISTICS_DEFAULT_EXPANDED_PANEL = 'analytics' as const;

export const STATISTICS_DEFAULT_EXPANDED_PANEL_OPTIONS: ReadonlyArray<{
  value: StatisticsDefaultExpandedPanel;
  label: string;
}> = [
  { value: 'analytics', label: 'Аналитика' },
  { value: 'categoryFilters', label: 'Категории' },
  { value: 'multiChart', label: 'Расходы по периодам' },
  { value: 'irregularSummary', label: 'Бюджет' },
  { value: 'none', label: 'Не раскрывать панели' },
];

const validPanelIds = new Set<StatisticsDefaultExpandedPanel>(
  STATISTICS_DEFAULT_EXPANDED_PANEL_OPTIONS.map(option => option.value)
);

export function isStatisticsDefaultExpandedPanel(
  value: unknown
): value is StatisticsDefaultExpandedPanel {
  return (
    typeof value === 'string' &&
    validPanelIds.has(value as StatisticsDefaultExpandedPanel)
  );
}

export function readStatisticsDefaultExpandedPanel(): StatisticsDefaultExpandedPanel {
  try {
    const value = localStorage.getItem(
      STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY
    );
    return isStatisticsDefaultExpandedPanel(value)
      ? value
      : STATISTICS_DEFAULT_EXPANDED_PANEL;
  } catch {
    return STATISTICS_DEFAULT_EXPANDED_PANEL;
  }
}

export function writeStatisticsDefaultExpandedPanel(
  value: StatisticsDefaultExpandedPanel
): void {
  if (!isStatisticsDefaultExpandedPanel(value)) {
    return;
  }

  try {
    localStorage.setItem(STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY, value);
  } catch {
    // Storage can be unavailable (for example, in private browsing mode).
  }
}

export function getInitialStatisticsCollapsedPanels(
  defaultExpandedPanel = readStatisticsDefaultExpandedPanel()
): Record<StatisticsPanelId, boolean> {
  return {
    analytics: defaultExpandedPanel !== 'analytics',
    categoryFilters: defaultExpandedPanel !== 'categoryFilters',
    multiChart: defaultExpandedPanel !== 'multiChart',
    irregularSummary: defaultExpandedPanel !== 'irregularSummary',
  };
}
