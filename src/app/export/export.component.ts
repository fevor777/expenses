import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from 'firebase/auth';
import { first, forkJoin, Observable, Subject, takeUntil } from 'rxjs';

import { Expense } from '../common/model/expense.model';
import { AuthService } from '../common/service/auth.service';
import { ExpenseService } from '../common/service/expense.service';
import { IrregularBudgetService } from '../common/service/irregular-budget.service';
import { SavingService } from '../common/service/saving.service';
import { TabsContainerComponent } from '../common/tabs-container.component';
import { TabComponent } from '../common/tab.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Budget,
  BudgetLimitRule,
  BudgetLimitSummary,
  BudgetLimitType,
  buildBudgetLimitId,
  canonicalizeBudget,
  roundBudgetCurrency,
} from '../common/model/budget.model';
import { FormsModule } from '@angular/forms';
import { GlobalSwipeLengthStoreService } from '../common/service/global-swipe-length-store.service';
import { DateTime } from 'luxon';
import { MorningReminderService } from '../common/service/morning-reminder.service';
import { Tag, normalizeTagName } from '../common/model/tag.model';
import { TagService } from '../common/service/tag.service';
import { TagStoreService } from '../common/service/tag-store.service';
import {
  DateFrame,
  Mode,
} from '../common/component/filter/date/dateFrame.model';
import { formatBudgetPeriodLabel } from '../common/model/budget-summary/budget-period.helper';
import { CategorySettingsComponent } from './category-settings/category-settings.component';
import { ResolvedCategory } from '../common/model/category.model';
import { CategoryService } from '../common/service/category.service';
import {
  BudgetLimitSummaryContext,
  BudgetLimitSummaryService,
  buildBudgetLimitSummaries,
} from '../common/service/budget-limit-summary.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TabsContainerComponent,
    TabComponent,
    FormsModule,
    CategorySettingsComponent,
  ],
})
export class ExportComponent implements OnDestroy {
  activeTab = 'reminders';
  savings$!: Observable<number>;
  savingsValue: number = 0;
  user$: Observable<User>;
  // Replaced legacy day-of-month anchor with explicit timestamp
  budgetPeriodDuration: number = 1;
  irregularBudgetValue: number = 0;
  // New timestamp-based start (ms). When set, overrides legacy day-of-month logic.
  budgetStartTs?: number;
  budgetTimezone?: string;
  // Optional minimum number of days before exhaustion date is surfaced
  minDayLimit?: number;

  // Swipe length configuration
  swipeLengthValue: number = 0;
  swipeLengthInput: number = 0;

  // Morning reminder configuration
  morningReminderEnabled: boolean = true;
  morningStartHour: number = 6;
  morningEndHour: number = 11;
  tags$: Observable<Tag[]>;
  tags: Tag[] = [];
  categories: ResolvedCategory[] = [];
  tagDraft: string = '';
  budgetLimits: BudgetLimitRule[] = [];
  categoryLimitTargetId: string = '';
  categoryLimitValue: number | null = null;
  categoryLimitError: string = '';
  tagLimitTargetId: string = '';
  tagLimitValue: number | null = null;
  tagLimitError: string = '';
  editingBudgetLimitId: string | null = null;
  budgetLimitSummaries: BudgetLimitSummary[] = [];
  exportRangeEnabled: boolean = false;
  exportStartDate: string = '';
  exportEndDate: string = '';
  exportRangeError: string = '';
  readonly maxExportDate: string = DateTime.now().toISODate() || '';

  // Display-only derived label for current period preview (e.g., "September 5 - October 8")
  get budgetPeriodLabel(): string {
    const periodDays = Math.floor(this.budgetPeriodDuration);
    if (periodDays <= 0 || !this.budgetStartTs) return '';
    return formatBudgetPeriodLabel(
      this.budgetStartTs,
      periodDays,
      this.budgetTimezone
    );
  }

  get activeBudgetCategories(): ResolvedCategory[] {
    return this.categories.filter(category => !category.hidden);
  }

  private readonly destroySubject: Subject<void> = new Subject();
  private budgetLimitSummaryContext?: BudgetLimitSummaryContext;
  private budgetFormDirty = false;
  private budgetLimitsDirty = false;

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private irregularBudgetService: IrregularBudgetService,
    private savingService: SavingService,
    private afAuth: AngularFireAuth,
    private swipeLengthStore: GlobalSwipeLengthStoreService,
    private morningReminderService: MorningReminderService,
    private categoryService: CategoryService,
    private budgetLimitSummaryService: BudgetLimitSummaryService,
    private tagService: TagService,
    private tagStoreService: TagStoreService
  ) {
    this.irregularBudgetService
      .getValue()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => {
        if (this.budgetFormDirty) {
          return;
        }
        this.irregularBudgetValue = v?.value || 0;
        this.budgetPeriodDuration = v?.period || 1;
        this.budgetStartTs = v?.periodStartTs;
        this.budgetTimezone = v?.timezone;
        this.minDayLimit = v?.minDayLimit || 0;
        // A delayed store/Firestore emission must not overwrite limit edits
        // that are waiting for the user to save the whole budget form.
        if (!this.budgetLimitsDirty) {
          this.budgetLimits = v?.limits ? [...v.limits] : [];
        }
        this.rebuildBudgetLimitSummaries();
      });
    this.savings$ = this.savingService.getSavings();
    this.savings$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => (this.savingsValue = v || 0));
    this.user$ = this.afAuth.user;
    // Load stored budget start day (balance date). Expecting format like 'YYYY-MM-DD' or empty.
    // Initialize swipe length values
    this.swipeLengthValue = this.swipeLengthStore.getSwipeLength();
    this.swipeLengthInput = this.swipeLengthValue;
    // Initialize morning reminder config
    const morningConfig = this.morningReminderService.getConfig();
    this.morningReminderEnabled = morningConfig.enabled;
    this.morningStartHour = morningConfig.startHour;
    this.morningEndHour = morningConfig.endHour;
    this.tags$ = this.tagStoreService.getTagsObs();
    // Keep local store in sync with Firestore, but render from store for optimistic UI updates.
    this.tagService
      .getTags(false)
      .pipe(takeUntil(this.destroySubject))
      .subscribe();

    this.tags$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(tags => (this.tags = tags || []));

    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
    this.categoryService.allCategories$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(categories => (this.categories = categories || []));
    this.budgetLimitSummaryService
      .getCurrentBudgetWithLimitSummaries()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(context => {
        this.budgetLimitSummaryContext = context;
        this.rebuildBudgetLimitSummaries();
      });

    this.initializeExportRange();
  }

  // Method to trigger Google Sign-in
  login() {
    this.authService
      .signInWithGoogle()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(res => {
        console.log('Logged in with Google:', res);
      });
  }

  // Method to trigger Sign-out
  logout() {
    this.authService.signOut().then(() => {
      console.log('User logged out');
    });
  }

  exportCSV(): void {
    const exportFilter = this.getExportDateFrame();
    if (this.exportRangeEnabled && !exportFilter) {
      return;
    }

    // const data = JSON.parse(localStorage.getItem('expenses') || '[]').map(
    //   (expense) => this.formatData(expense)
    // );
    // if (data?.length > 0) {
    //   this.exportToFile(data);
    // }

    this.expenseService
      .getExpenses(exportFilter)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(expenses => {
        if (Array.isArray(expenses) && expenses?.length) {
          const data = expenses.map(exp => this.formatData(exp));
          this.exportToFile(data, exportFilter);
        }
      });
  }

  convertToCSV(data: any[]): string {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map(row => {
        return Object.values(row)
          .map(value => {
            // Escape double quotes and commas if necessary
            if (typeof value === 'string') {
              value = value.replace(/"/g, '""');
              if (value.includes(',')) {
                return `"${value}"`;
              }
            }
            return value;
          })
          .join(',');
      })
      .join('\n');
  }

  exportFirebase(uid: string): void {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    if (data.length > 0) {
      const responses = data
        .map(expense => ({ ...expense, uid }))
        .map(expense => this.expenseService.addExpense(expense));
      forkJoin(responses)
        .pipe(takeUntil(this.destroySubject))
        .subscribe(() => {
          localStorage.removeItem('expenses');
          console.log('Data migrated successfully to Firestore');
        });
    }
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  private formatData(
    data: Expense
  ): Record<string, string | number | string[]> {
    return {
      id: data?.id || '',
      uid: data?.uid || '',
      category: data.category || '',
      amount: data?.amount || 0,
      currency: data?.currency || '',
      date: data.date || 0,
      description: data.description || '',
      tagIds: data.tagIds || [],
      includeInBalance: String(data.includeInBalance) || '',
      tags: this.getTagNames(data.tagIds).join('|'),
    };
  }

  private getTagNames(tagIds?: string[]): string[] {
    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      return [];
    }

    const tagsById = new Map(this.tags.map(tag => [tag.id, tag.name]));
    return tagIds.map(tagId => tagsById.get(tagId) || tagId).filter(Boolean);
  }

  private exportToFile(data: any[], dateFilter?: DateFrame): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = this.getExportFileName(dateFilter);
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  onEditSavings(): void {
    const newVal = prompt('Enter savings', this.savingsValue.toString());
    if (newVal !== null) {
      const num = Number(newVal);
      if (!isNaN(num) && num >= 0) {
        this.savingService
          .addSaving(num)
          .pipe(first(), takeUntil(this.destroySubject))
          .subscribe();
      }
    }
  }

  onStartDateChange(ev: Event): void {
    const val = (ev.target as HTMLInputElement).value; // format yyyy-mm-dd
    this.budgetFormDirty = true;
    if (!val) {
      this.budgetStartTs = undefined;
      this.rebuildBudgetLimitSummaries();
      return;
    }
    const parts = val.split('-').map(p => parseInt(p, 10));
    if (parts.length === 3 && !parts.some(isNaN)) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      this.budgetStartTs = dt.getTime();
    }
    this.rebuildBudgetLimitSummaries();
  }

  onSaveBudget(): void {
    const durationOk =
      this.budgetPeriodDuration >= 1 && this.budgetPeriodDuration <= 120;
    const valueOk = this.irregularBudgetValue >= 0;
    if (!durationOk || !valueOk || !this.budgetStartTs) return;
    const budget: Budget = {
      value: this.irregularBudgetValue,
      period: Math.floor(this.budgetPeriodDuration),
      periodStartTs: this.budgetStartTs,
      timezone:
        this.budgetTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      minDayLimit: this.minDayLimit,
      limits: this.budgetLimits.length > 0 ? this.budgetLimits : undefined,
    };
    this.budgetFormDirty = false;
    this.budgetLimitsDirty = false;
    this.irregularBudgetService
      .addValue(budget)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe();
  }

  onBudgetFieldChange(): void {
    this.budgetFormDirty = true;
    this.rebuildBudgetLimitSummaries();
  }

  addBudgetLimit(type: BudgetLimitType): void {
    const error = this.validateBudgetLimitDraft(type);
    if (type === 'category') {
      this.categoryLimitError = error;
    } else {
      this.tagLimitError = error;
    }
    if (error) {
      return;
    }

    const targetId =
      type === 'category' ? this.categoryLimitTargetId : this.tagLimitTargetId;
    const rawValue =
      type === 'category' ? this.categoryLimitValue : this.tagLimitValue;
    if (!targetId || rawValue === null) {
      return;
    }

    const limit: BudgetLimitRule = {
      id: buildBudgetLimitId(type, targetId),
      type,
      targetId,
      value: roundBudgetCurrency(rawValue),
    };
    const editingId = this.getEditingBudgetLimit(type)?.id;
    this.budgetLimits = editingId
      ? this.budgetLimits.map(current =>
          current.id === editingId ? limit : current
        )
      : [...this.budgetLimits, limit];
    this.budgetLimits.sort(this.sortBudgetLimits);
    this.budgetFormDirty = true;
    this.budgetLimitsDirty = true;

    if (type === 'category') {
      this.categoryLimitTargetId = '';
      this.categoryLimitValue = null;
      this.categoryLimitError = '';
      this.editingBudgetLimitId = null;
      this.rebuildBudgetLimitSummaries();
      return;
    }

    this.tagLimitTargetId = '';
    this.tagLimitValue = null;
    this.tagLimitError = '';
    this.editingBudgetLimitId = null;
    this.rebuildBudgetLimitSummaries();
  }

  editBudgetLimit(limit: BudgetLimitRule): void {
    this.editingBudgetLimitId = limit.id;
    if (limit.type === 'category') {
      this.categoryLimitTargetId = limit.targetId;
      this.categoryLimitValue = limit.value;
      this.categoryLimitError = '';
      return;
    }

    this.tagLimitTargetId = limit.targetId;
    this.tagLimitValue = limit.value;
    this.tagLimitError = '';
  }

  cancelBudgetLimitEdit(type: BudgetLimitType): void {
    if (!this.isEditingBudgetLimit(type)) {
      return;
    }

    this.editingBudgetLimitId = null;
    if (type === 'category') {
      this.categoryLimitTargetId = '';
      this.categoryLimitValue = null;
      this.categoryLimitError = '';
      return;
    }

    this.tagLimitTargetId = '';
    this.tagLimitValue = null;
    this.tagLimitError = '';
  }

  deleteBudgetLimit(limitId: string): void {
    this.budgetLimits = this.budgetLimits.filter(limit => limit.id !== limitId);
    this.budgetFormDirty = true;
    this.budgetLimitsDirty = true;
    if (this.editingBudgetLimitId === limitId) {
      this.editingBudgetLimitId = null;
    }
    this.categoryLimitError = this.validateBudgetLimitDraft('category');
    this.tagLimitError = this.validateBudgetLimitDraft('tag');
    this.rebuildBudgetLimitSummaries();
  }

  onBudgetLimitDraftChange(type: BudgetLimitType): void {
    if (type === 'category') {
      this.categoryLimitError = this.validateBudgetLimitDraft(type);
      return;
    }

    this.tagLimitError = this.validateBudgetLimitDraft(type);
  }

  getBudgetLimitTargetLabel(limit: BudgetLimitRule): string {
    if (limit.type === 'category') {
      const category = this.categories.find(item => item.id === limit.targetId);
      return category ? category.name : `Unknown category (${limit.targetId})`;
    }

    const tag = this.tags.find(item => item.id === limit.targetId);
    return tag ? tag.name : `Deleted tag (${limit.targetId})`;
  }

  isBudgetLimitOrphaned(limit: BudgetLimitRule): boolean {
    if (limit.type === 'category') {
      const category = this.categories.find(item => item.id === limit.targetId);
      return !category || category.hidden === true;
    }

    return !this.tags.some(item => item.id === limit.targetId);
  }

  isEditingBudgetLimit(type: BudgetLimitType): boolean {
    return this.getEditingBudgetLimit(type) !== undefined;
  }

  trackByBudgetLimitSummary(_: number, summary: BudgetLimitSummary): string {
    return summary.id;
  }

  getBudgetLimitProgressWidth(summary: BudgetLimitSummary): number {
    return Math.max(0, Math.min(100, summary.percentUsed));
  }

  trackByBudgetLimit(_: number, limit: BudgetLimitRule): string {
    return limit.id;
  }

  // Legacy derivation removed – periodStartTs is now the single source of truth.

  onSaveSwipeLength(): void {
    if (Number.isFinite(this.swipeLengthInput) && this.swipeLengthInput > 0) {
      this.swipeLengthValue = this.swipeLengthStore.saveSwipeLength(
        this.swipeLengthInput
      );
    } else {
      // Reset input to current valid value if invalid provided
      this.swipeLengthInput = this.swipeLengthValue;
    }
  }

  // Morning reminder methods
  onMorningReminderToggle(event: Event): void {
    this.morningReminderEnabled = (event.target as HTMLInputElement).checked;
    this.morningReminderService.saveConfig({
      enabled: this.morningReminderEnabled,
      startHour: this.morningStartHour,
      endHour: this.morningEndHour,
    });
  }

  onSaveMorningReminder(): void {
    if (
      this.morningStartHour >= 0 &&
      this.morningStartHour < 24 &&
      this.morningEndHour >= 0 &&
      this.morningEndHour < 24 &&
      this.morningStartHour < this.morningEndHour
    ) {
      this.morningReminderService.saveConfig({
        enabled: this.morningReminderEnabled,
        startHour: this.morningStartHour,
        endHour: this.morningEndHour,
      });
    }
  }

  onTestMorningReminder(): void {
    // Reset the "shown today" flag and trigger reminder
    this.morningReminderService.resetTodayFlag();
    this.morningReminderService
      .checkAndShowMorningReminder()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(shown => {
        if (!shown) {
          // If browser notification didn't work, show in-app
          this.morningReminderService.resetTodayFlag();
          this.morningReminderService
            .showInAppMorningReminder()
            .pipe(first(), takeUntil(this.destroySubject))
            .subscribe();
        }
      });
  }

  addTag(): void {
    const normalizedName = normalizeTagName(this.tagDraft);
    if (!normalizedName) {
      return;
    }

    if (this.tags.some(tag => tag.normalizedName === normalizedName)) {
      return;
    }

    this.tagService
      .addTag(this.tagDraft)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(() => {
        this.tagDraft = '';
      });
  }

  renameTag(tag: Tag): void {
    const nextName = prompt('Rename tag', tag.name);
    if (nextName === null) {
      return;
    }

    const normalizedName = normalizeTagName(nextName);
    if (!normalizedName || normalizedName === tag.normalizedName) {
      return;
    }

    if (
      this.tags.some(
        item => item.id !== tag.id && item.normalizedName === normalizedName
      )
    ) {
      return;
    }

    this.tagService
      .updateTag({ ...tag, name: nextName })
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe();
  }

  toggleTagStar(tag: Tag, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.tagService
      .updateTag({ ...tag, star: checked })
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe();
  }

  deleteTag(tag: Tag): void {
    if (!tag.id || !confirm(`Delete tag "${tag.name}"?`)) {
      return;
    }

    this.tagService
      .deleteTag(tag.id)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe();
  }

  onExportRangeToggle(event: Event): void {
    this.exportRangeEnabled = (event.target as HTMLInputElement).checked;
    this.exportRangeError = '';
  }

  onExportDateChange(): void {
    this.exportRangeError = '';
  }

  get isExportRangeInvalid(): boolean {
    return this.exportRangeEnabled && !this.isExportRangeValid();
  }

  private initializeExportRange(): void {
    const now = DateTime.now();
    this.exportStartDate = now.startOf('month').toISODate() || '';
    this.exportEndDate = now.toISODate() || '';
  }

  private isExportRangeValid(): boolean {
    return this.getExportDateFrame(false) !== undefined;
  }

  private getExportDateFrame(showError = true): DateFrame | undefined {
    if (!this.exportRangeEnabled) {
      this.exportRangeError = '';
      return undefined;
    }

    if (!this.exportStartDate || !this.exportEndDate) {
      if (showError) {
        this.exportRangeError = 'Выберите обе даты для экспорта.';
      }
      return undefined;
    }

    const start = DateTime.fromISO(this.exportStartDate).startOf('day');
    const finish = DateTime.fromISO(this.exportEndDate).endOf('day');
    const today = DateTime.now().endOf('day');

    if (!start.isValid || !finish.isValid) {
      if (showError) {
        this.exportRangeError = 'Не удалось распознать выбранные даты.';
      }
      return undefined;
    }

    if (start > finish) {
      if (showError) {
        this.exportRangeError =
          'Дата начала не может быть позже даты окончания.';
      }
      return undefined;
    }

    if (finish > today) {
      if (showError) {
        this.exportRangeError = 'Нельзя экспортировать будущий период.';
      }
      return undefined;
    }

    this.exportRangeError = '';
    return {
      start,
      finish,
      mode: Mode.CUSTOM,
      display: `${this.exportStartDate} - ${this.exportEndDate}`,
    };
  }

  private getExportFileName(dateFilter?: DateFrame): string {
    if (!dateFilter) {
      return 'exported_data.csv';
    }

    const start = dateFilter.start.toFormat('yyyy-MM-dd');
    const finish = dateFilter.finish.toFormat('yyyy-MM-dd');
    return `exported_data_${start}_${finish}.csv`;
  }

  private validateBudgetLimitDraft(type: BudgetLimitType): string {
    const targetId =
      type === 'category' ? this.categoryLimitTargetId : this.tagLimitTargetId;
    const value =
      type === 'category' ? this.categoryLimitValue : this.tagLimitValue;

    if (!targetId) {
      return `Select a ${type}.`;
    }

    const editingId = this.getEditingBudgetLimit(type)?.id;
    if (
      this.budgetLimits.some(
        limit =>
          limit.id !== editingId &&
          limit.type === type &&
          limit.targetId === targetId
      )
    ) {
      return `A ${type} limit for this target already exists.`;
    }

    if (value === null || value === undefined || value === ('' as never)) {
      return 'Enter a limit amount.';
    }

    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      return 'Enter a valid amount greater than or equal to 0.';
    }

    return '';
  }

  private sortBudgetLimits(
    left: BudgetLimitRule,
    right: BudgetLimitRule
  ): number {
    if (left.type !== right.type) {
      return left.type === 'category' ? -1 : 1;
    }

    return left.targetId.localeCompare(right.targetId);
  }

  private getEditingBudgetLimit(
    type: BudgetLimitType
  ): BudgetLimitRule | undefined {
    if (!this.editingBudgetLimitId) {
      return undefined;
    }

    return this.budgetLimits.find(
      limit => limit.id === this.editingBudgetLimitId && limit.type === type
    );
  }

  private rebuildBudgetLimitSummaries(): void {
    if (!this.budgetLimitSummaryContext) {
      this.budgetLimitSummaries = [];
      return;
    }

    const budget = canonicalizeBudget({
      ...this.budgetLimitSummaryContext.budget,
      value: this.irregularBudgetValue,
      period: this.budgetPeriodDuration,
      periodStartTs: this.budgetStartTs,
      timezone: this.budgetTimezone,
      minDayLimit: this.minDayLimit,
      limits: this.budgetLimits,
    });
    this.budgetLimitSummaries = buildBudgetLimitSummaries(
      budget,
      this.budgetLimitSummaryContext.expenses,
      this.budgetLimitSummaryContext.categories,
      this.budgetLimitSummaryContext.tags
    );
  }
}
