export class Budget {
  uid?: string;
  value: number;
  period: number;
  /**
   * Start-of-period timestamp (ms since epoch, start-of-day local time).
   */
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
}
