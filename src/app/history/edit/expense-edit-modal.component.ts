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

  readonly categories: Category[] = Categories;

  ngOnInit(): void {
    if (this.expense) {
      this.amount = this.expense.amount;
      this.description = this.expense.description || '';
      this.category = this.expense.category;
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
    };
    this.apply.emit(updated);
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
