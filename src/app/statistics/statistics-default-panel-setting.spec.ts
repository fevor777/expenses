import {
  getInitialStatisticsCollapsedPanels,
  readStatisticsDefaultExpandedPanel,
  STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY,
  STATISTICS_DEFAULT_EXPANDED_PANEL_OPTIONS,
  writeStatisticsDefaultExpandedPanel,
} from './statistics-default-panel-setting';

describe('statistics default expanded panel setting', () => {
  beforeEach(() => {
    localStorage.removeItem(STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY);
  });

  afterEach(() => {
    localStorage.removeItem(STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY);
  });

  it('defaults to analytics when localStorage is empty', () => {
    expect(readStatisticsDefaultExpandedPanel()).toBe('analytics');
    expect(getInitialStatisticsCollapsedPanels()).toEqual({
      analytics: false,
      categoryFilters: true,
      multiChart: true,
      irregularSummary: true,
    });
  });

  it('restores every supported value', () => {
    for (const option of STATISTICS_DEFAULT_EXPANDED_PANEL_OPTIONS) {
      localStorage.setItem(
        STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY,
        option.value
      );

      expect(readStatisticsDefaultExpandedPanel()).toBe(option.value);
      expect(getInitialStatisticsCollapsedPanels()).toEqual({
        analytics: option.value !== 'analytics',
        categoryFilters: option.value !== 'categoryFilters',
        multiChart: option.value !== 'multiChart',
        irregularSummary: option.value !== 'irregularSummary',
      });
    }
  });

  it('falls back to analytics for an invalid stored value', () => {
    localStorage.setItem(
      STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY,
      'legacy-panel'
    );

    expect(readStatisticsDefaultExpandedPanel()).toBe('analytics');
  });

  it('collapses every panel when no panel is selected', () => {
    localStorage.setItem(STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY, 'none');

    expect(getInitialStatisticsCollapsedPanels()).toEqual({
      analytics: true,
      categoryFilters: true,
      multiChart: true,
      irregularSummary: true,
    });
  });

  it('writes the selected panel identifier to localStorage', () => {
    writeStatisticsDefaultExpandedPanel('multiChart');

    expect(
      localStorage.getItem(STATISTICS_DEFAULT_EXPANDED_PANEL_STORAGE_KEY)
    ).toBe('multiChart');
  });
});
