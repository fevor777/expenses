import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Categories, Category } from '../../common/model/categories';
import { Expense } from '../../common/model/expense.model';

@Component({
  selector: 'app-expense-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-edit-modal.component.html',
  styleUrls: ['./expense-edit-modal.component.scss'],
})
export class ExpenseEditModalComponent {
  @Input() expense: Expense;
  @Output() apply: EventEmitter<Expense> = new EventEmitter<Expense>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();

  // Local mutable copies for editing
  amount: number; // stored as number
  description: string = '';
  category: string = '';
  // HTML datetime-local formatted string (yyyy-MM-ddTHH:mm)
  dateLocal: string = '';

  readonly categories: Category[] = Categories;

  ngOnInit(): void {
    if (this.expense) {
      this.amount = this.expense.amount;
      this.description = this.expense.description || '';
      this.category = this.expense.category;
      // Convert epoch ms to local ISO string without seconds for datetime-local
      try {
        const d = new Date(this.expense.date);
        const pad = (v: number) => v.toString().padStart(2, '0');
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hour = pad(d.getHours());
        const minute = pad(d.getMinutes());
        this.dateLocal = `${year}-${month}-${day}T${hour}:${minute}`;
      } catch {
        this.dateLocal = '';
      }
    }
  }

  onBackdrop(): void {
    this.cancel.emit();
  }

  onApply(): void {
    if (!this.expense) {
      this.cancel.emit();
      return;
    }
    const updated: Expense = {
      ...this.expense,
      amount: +(+this.amount || 0).toFixed(2),
      description: this.description?.trim(),
      category: this.category,
      date: this.parseDateLocalToEpoch(this.dateLocal, this.expense.date)
    };
    this.apply.emit(updated);
  }

  private parseDateLocalToEpoch(value: string, fallback: number): number {
    if (!value) return fallback;
    const date = new Date(value);
    const t = date.getTime();
    return isNaN(t) ? fallback : t;
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.cancel.emit();
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      this.onApply();
    }
  }
}
