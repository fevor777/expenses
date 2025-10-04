import { DateFrame } from '../../common/component/filter/date/dateFrame.model';

/**
 * Lightweight period summary model (no budget fields) mirroring the pattern of BudgetSummaryService
 * but focused on narrative + key structural metrics. Future dynamic computation can extend this.
 */
export interface PeriodSummary {
  key: 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth';
  title: string; // Display heading (e.g. 'Сегодня')
  frame?: DateFrame; // Optional timeframe descriptor for navigation to other pages
  paragraphs: string[]; // Narrative paragraphs in display order
}
