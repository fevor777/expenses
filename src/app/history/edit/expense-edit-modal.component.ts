import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResolvedCategory } from '../../common/model/category.model';
import { Expense } from '../../common/model/expense.model';
import { normalizeTagIds } from '../../common/model/tag.model';
import { ExpenseService } from '../../common/service/expense.service';
import { first, Subject, Subscription, takeUntil } from 'rxjs';
import { SpinnerComponent } from '../../common/component/spinner/spinner.component';
import { TagSelectorComponent } from '../../common/component/tag-selector/tag-selector.component';
import { CategoryService } from '../../common/service/category.service';

@Component({
  selector: 'app-expense-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, SpinnerComponent, TagSelectorComponent],
  templateUrl: './expense-edit-modal.component.html',
  styleUrls: ['./expense-edit-modal.component.scss'],
})
export class ExpenseEditModalComponent {
  @Input() expense: Expense;
  // When true, load (or reload) the latest stored expense ignoring provided input expense.
  // Name uses plural per original request (isLoadLatestExpenses) even though it results in a single latest item.
  @Input() isLoadLatestExpenses: boolean = false;
  @Output() apply: EventEmitter<Expense> = new EventEmitter<Expense>();
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() delete: EventEmitter<Expense> = new EventEmitter<Expense>();
  private unsubscribe: Subject<void> = new Subject();

  // Local mutable copies for editing
  amount: number; // stored as number
  description: string = '';
  category: string = '';
  tagIds: string[] = [];
  // HTML datetime-local formatted string (yyyy-MM-ddTHH:mm)
  dateLocal: string = '';

  categories: ResolvedCategory[] = [];
  private allCategories: ResolvedCategory[] = [];

  private latestSub?: Subscription;
  isLoadingLatest = false; // controls spinner when loading the latest expense

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryService.allCategories$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(categories => {
        this.allCategories = categories;
        this.refreshSelectableCategories();
      });
    if (this.isLoadLatestExpenses) {
      this.isLoadingLatest = true;
      // Subscribe once to get the latest expense (uses cache first by default)
      this.latestSub = this.expenseService
        .getLatestExpense()
        .pipe(takeUntil(this.unsubscribe), first())
        .subscribe({
          next: latest => {
            if (latest) {
              this.expense = latest;
              this.populateLocalFieldsFromExpense();
            } else if (this.expense) {
              // Fallback to provided input expense if service yielded nothing
              this.populateLocalFieldsFromExpense();
            }
          },
          error: () => (this.isLoadingLatest = false),
          complete: () => (this.isLoadingLatest = false),
        });
    } else if (this.expense) {
      this.populateLocalFieldsFromExpense();
    }
  }

  ngOnDestroy(): void {
    this.latestSub?.unsubscribe();
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private populateLocalFieldsFromExpense(): void {
    if (!this.expense) return;
    this.amount = this.expense.amount;
    this.description = this.expense.description || '';
    this.category = this.expense.category;
    this.refreshSelectableCategories();
    this.tagIds = this.expense.tagIds || [];
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
      tagIds: normalizeTagIds(this.tagIds),
      date: this.parseDateLocalToEpoch(this.dateLocal, this.expense.date),
    };
    if (this.category !== this.expense.category) {
      updated.includeInBalance = this.allCategories.find(
        category => category.id === this.category
      )?.includeInBalance;
    }
    this.apply.emit(updated);
  }

  onTagIdsChange(tagIds: string[]): void {
    this.tagIds = tagIds || [];
  }

  onDelete(): void {
    if (!this.expense) {
      this.cancel.emit();
      return;
    }
    this.delete.emit(this.expense);
  }

  private parseDateLocalToEpoch(value: string, fallback: number): number {
    if (!value) return fallback;
    const date = new Date(value);
    const t = date.getTime();
    return isNaN(t) ? fallback : t;
  }

  private refreshSelectableCategories(): void {
    this.categories = this.allCategories.filter(
      category => !category.hidden || category.id === this.expense?.category
    );
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
