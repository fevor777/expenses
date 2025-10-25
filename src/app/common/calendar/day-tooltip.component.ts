import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

// Local duplicate of interfaces (minimal change). If reused elsewhere later we can extract.
export interface DayCategoryStat {
  id: string;
  name: string;
  short: string;
  count: number;
  amount: number;
}
export interface DayTooltipData {
  date: Date;
  total: number; // total expense entries
  categories: DayCategoryStat[];
  totalAmount: number; // summed includeInBalance amount
}

@Component({
  selector: 'app-day-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-tooltip.component.html',
  styleUrls: ['./day-tooltip.component.scss']
})
export class DayTooltipComponent {
  @Input() data: DayTooltipData | null = null;
  @Output() navigateHistory = new EventEmitter<Date>();
  @Output() navigateStatistics = new EventEmitter<Date>();

  formatAmount(amount: number | undefined | null): string {
    if (amount === undefined || amount === null || isNaN(amount)) return '0 €';
    const rounded = Math.abs(amount - Math.round(amount)) < 0.05 ? amount.toFixed(0) : amount.toFixed(1);
    return rounded.replace(/\.0$/, '') + '€';
  }

  onHistory() {
    if (this.data?.date) this.navigateHistory.emit(this.data.date);
  }
  onStatistics() {
    if (this.data?.date) this.navigateStatistics.emit(this.data.date);
  }
}
