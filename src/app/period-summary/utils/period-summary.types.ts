import { Expense } from '../../common/model/expense.model';

export type PeriodFrameKey = 'today' | 'yesterday' | 'week' | 'month' | 'lastMonth';

export interface PeriodFrameMeta {
  key: PeriodFrameKey;
  title: string;
  start: number; // ms
  finish: number; // ms inclusive
  mode: 'day' | 'week' | 'month'; // (lastMonth shares 'month' mode)
  elapsedDays?: number; // for week/month (days passed incl. today)
}

export interface CategoryAggregate {
  id: string;
  name: string;
  amount: number;
  count: number;
  percent: number; // 0..100
}

export interface PeriodMetricsSnapshot {
  frame: PeriodFrameMeta;
  total: number;
  count: number;
  avg: number;
  regularSum: number;
  irregularSum: number;
  regularCount: number;
  irregularCount: number;
  extraSum: number;
  extraCount: number;
  unnecessarySum: number;
  unnecessaryCount: number;
  categories: CategoryAggregate[];
  largest?: Expense;
  activeDays?: number; // only for week/month
  top2Concentration?: number; // only month
}
