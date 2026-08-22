import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  combineLatest,
  first,
} from 'rxjs';

import { CategoriesComponent } from '../common/component/category/categories.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { DateTime } from 'luxon';
import { Mode } from '../common/component/filter/date/dateFrame.model';
import { NotificationService } from '../common/component/notification/notification.service';
import { ExpressionEvaluator } from '../common/expression-evaluator';
import { ResolvedCategory } from '../common/model/category.model';
import { Currency } from '../common/model/currency';
import { Expense } from '../common/model/expense.model';
import { BalanceDateService } from '../common/service/balance-date.service';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { SwipeDirective } from '../common/swipe.directive';
import { ExpenseHeaderComponent } from './header/expense-header.component';
import { ExpenseNumberBoardComponent } from './number-board/expense-number-board.component';
import { CalculatorModalComponent } from '../common/component/calculator/calculator-modal.component';
import {
  BudgetSummaryService,
  BudgetSummaryBuildResult,
} from '../common/service/budget-summary.service';
import { CalendarComponent } from '../common/calendar/calendar.component';
import { DescriptionEditModalComponent } from './number-board/description-edit-modal.component';
import { ExpenseEditModalComponent } from '../history/edit/expense-edit-modal.component';
import { lineRemaining } from '../common/model/budget-summary/budget-summary.br-notifi-formatter';
import { MorningReminderService } from '../common/service/morning-reminder.service';
import { TagSelectorComponent } from '../common/component/tag-selector/tag-selector.component';
import { normalizeTagIds } from '../common/model/tag.model';
import { CategoryService } from '../common/service/category.service';
import { BudgetLimitSummary } from '../common/model/budget.model';
import { BudgetLimitSummaryService } from '../common/service/budget-limit-summary.service';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CategoriesComponent,
    FormsModule,
    SwipeDirective,
    ExpenseNumberBoardComponent,
    ExpenseHeaderComponent,
    CalculatorModalComponent,
    CalendarComponent,
    DescriptionEditModalComponent,
    ExpenseEditModalComponent,
    TagSelectorComponent,
  ],
})
export class ExpenseComponent implements OnInit, OnDestroy {
  enteredAmount = '';
  currentAmount: number = 0;
  currentBalanceAmount: number = 0;
  balance$: Observable<number>;
  balanceDate$: Observable<string>;
  monthlyExpenses: Expense[] = [];
  todaysExpenses: Expense[] = [];
  budgetSummary: BudgetSummaryBuildResult;
  // Loading flag for header amount spinner
  isAmountsLoading: boolean = false;

  currency: Currency;
  description: string = '';
  selectedTagIds: string[] = [];
  calendarSelectedDate: Date = new Date();

  showCalculator = false;
  showCalendar = false;
  showNumberBoard: boolean = true;
  showBudgetNotification: boolean = false;
  showDescriptionModal: boolean = false;
  showEditLatestModal: boolean = false;

  private unsubscribe: Subject<void> = new Subject();
  private categoriesById = new Map<string, ResolvedCategory>();

  // Global long press logic removed

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private expenseService: ExpenseService,
    private balanceDateService: BalanceDateService,
    private dateFilterService: DateFilterService,
    private expenseSummaryService: BudgetSummaryService,
    private morningReminderService: MorningReminderService,
    private categoryService: CategoryService,
    private budgetLimitSummaryService: BudgetLimitSummaryService
  ) {}

  ngOnInit(): void {
    this.categoryService
      .getAllCategories()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(categories => {
        this.categoriesById = new Map(
          categories.map(category => [category.id, category])
        );
      });
    this.isAmountsLoading = true;
    this.expenseService
      .getExpenses(this.dateFilterService.getInitialMonthValue())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(expenses => {
        this.calculateAmounts(expenses);
        this.isAmountsLoading = false;
      });

    this.balanceDate$ = this.balanceDateService.getBalanceDate();

    const currencyInLocalStorage = localStorage.getItem('currency');
    if (currencyInLocalStorage) {
      this.currency = JSON.parse(currencyInLocalStorage);
    } else {
      this.currency = {
        code: 'EUR',
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }

    this.notificationService.closeBudget$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.showBudgetNotification = false;
      });

    // Check and show morning reminder if applicable
    this.morningReminderService
      .checkAndShowMorningReminder()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }

  onCategoryClick(categoryName: string) {
    const exchangeRate = this.currency?.exchangeRate || 1;
    const calculatedAmount = ExpressionEvaluator.evaluate(this.enteredAmount);
    const amount = Math.round((calculatedAmount / exchangeRate) * 100) / 100;
    if (amount > 0) {
      const originalDescription = this.description; // capture before reset for notification context
      const newExpense: Expense = {
        category: categoryName,
        amount: amount,
        currency: 'EUR',
        date: Date.now(),
        includeInBalance:
          this.categoriesById.get(categoryName)?.includeInBalance,
        description: originalDescription || undefined,
        tagIds: normalizeTagIds(this.selectedTagIds),
      };
      if (!originalDescription) {
        delete newExpense.description;
      }
      this.enteredAmount = '';
      this.description = '';
      this.selectedTagIds = [];
      this.expenseService
        .addExpense(newExpense)
        .pipe(
          switchMap(addedExpense =>
            combineLatest([
              this.expenseSummaryService.buildCurrentBudgetSummary(),
              this.budgetLimitSummaryService
                .getCurrentLimitSummaries()
                .pipe(first()),
              of(addedExpense),
            ])
          ),
          tap(
            ([summary, budgetLimitSummaries, addedExpense]: [
              BudgetSummaryBuildResult,
              BudgetLimitSummary[],
              Expense,
            ]) => {
              this.notificationService.summaryBuildResultCache = summary;
              this.onShowNumberBoard();
              this.showNotification(
                categoryName,
                amount,
                addedExpense,
                originalDescription,
                summary,
                budgetLimitSummaries
              );
            }
          ),
          switchMap(
            ([summary]: [
              BudgetSummaryBuildResult,
              BudgetLimitSummary[],
              Expense,
            ]) =>
              this.expenseSummaryService.sendBrowserNotificationByBudgetSummary(
                summary
              )
          ),
          takeUntil(this.unsubscribe)
        )
        .subscribe();
    }
  }

  onHideNumberBoard(): void {
    this.notificationService.hide();
    this.showBudgetNotification = false;
    this.showCalendar = false;
    this.showNumberBoard = false;
  }

  onShowNumberBoard(): void {
    this.notificationService.hide();
    this.showBudgetNotification = false;
    this.showNumberBoard = true;
  }

  navigateToHistory(date?: Date): void {
    this.notificationService.hide();
    if (date instanceof Date) {
      // Persist single-day frame for history page
      this.dateFilterService.dateFilter = {
        start: DateTime.fromJSDate(date).startOf('day'),
        finish: DateTime.fromJSDate(date).endOf('day'),
        display: date.toLocaleDateString('ru-RU'),
        mode: Mode.DAY,
      };
      // Preserve description/category context if user has typed something
      if (this.description)
        this.dateFilterService.description = this.description;
    }
    this.router.navigate(['/history']);
  }

  navigateToStatistics(date?: Date): void {
    this.notificationService.hide();
    if (date instanceof Date) {
      this.dateFilterService.dateFilter = {
        start: DateTime.fromJSDate(date).startOf('day'),
        finish: DateTime.fromJSDate(date).endOf('day'),
        display: date.toLocaleDateString('ru-RU'),
        mode: Mode.DAY,
      };
      if (this.description)
        this.dateFilterService.description = this.description;
    }
    this.router.navigate(['/statistics']);
  }

  navigateToExport(): void {
    this.notificationService.hide();
    this.router.navigate(['/export']);
  }

  navigateToDetails(): void {
    this.notificationService.hide();
    this.router.navigate(['/period-summary']);
  }

  onHeaderBudgetInfoClick(): void {
    if (!this.showBudgetNotification) {
      this.showBudgetNotification = true;
      this.showCalendar = false;
      this.openPeriodBudgetNotification();
    } else {
      this.showBudgetNotification = false;
      this.notificationService.hide();
    }
  }

  private openPeriodBudgetNotification(): void {
    this.expenseSummaryService
      .buildCurrentBudgetSummary()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((result: BudgetSummaryBuildResult) => {
        this.notificationService.summaryBuildResultCache = result;
        return this.expenseSummaryService.sendAppNotificationByBudgetSummary(
          result
        );
      });
  }

  onAmountChange(amount: string): void {
    this.enteredAmount = amount;
    if (amount) {
      this.notificationService.hide();
      this.showBudgetNotification = false;
      this.showCalendar = false;
    }
  }

  onOpenCalculator(): void {
    this.showCalculator = true;
    this.showCalendar = false;
    this.showBudgetNotification = false;
    this.notificationService.hide();
  }

  onOpenCalendar(): void {
    if (!this.showCalendar) {
      this.calendarSelectedDate = new Date();
      this.showCalendar = true;
      this.showBudgetNotification = false;
      this.notificationService.hide();
    } else {
      this.showCalendar = false;
    }
  }

  onCloseCalendar(): void {
    this.showCalendar = false;
  }

  onCalculatorApply(val: string): void {
    this.enteredAmount = val;
    this.showCalculator = false;
  }

  onCalculatorCancel(): void {
    this.showCalculator = false;
  }

  onCurrencyChange(currency: Currency): void {
    this.currency = currency;
    localStorage.setItem('currency', JSON.stringify(this.currency));
  }

  onDescriptionChange(description: string): void {
    this.description = description;
  }

  onTagIdsChange(tagIds: string[]): void {
    this.selectedTagIds = tagIds || [];
  }

  onOpenDescription(): void {
    this.notificationService.hide();
    this.showDescriptionModal = true;
    this.showBudgetNotification = false;
    this.showCalendar = false;
  }

  onDescriptionApply(event: { description: string; tagIds: string[] }): void {
    this.description = event.description;
    this.selectedTagIds = event.tagIds;
    this.showDescriptionModal = false;
  }

  onDescriptionCancel(): void {
    this.showDescriptionModal = false;
  }

  onOpenEditLatest(): void {
    this.notificationService.hide();
    this.showBudgetNotification = false;
    this.showEditLatestModal = true;
    this.showCalendar = false;
  }

  onApplyEditLatest(expense: Expense): void {
    this.onLatestExpenseUpdated(expense);
    this.showEditLatestModal = false;
  }

  onCancelEditLatest(): void {
    this.showEditLatestModal = false;
  }

  onDeleteLatest(expense: Expense): void {
    this.onLatestExpenseDeleted(expense);
    this.showEditLatestModal = false;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  showNotification(
    categoryName,
    amount,
    addedExpense?: Expense,
    originalDescription?: string,
    summary?: BudgetSummaryBuildResult,
    budgetLimitSummaries: BudgetLimitSummary[] = []
  ): void {
    const todaysAmountByCategory = this.getTodaysAmount(categoryName);
    const monthlyAmountByCategory =
      this.getMonthlyAmountByCategory(categoryName);
    const monthlyTotal = this.getMonthlyAmount();
    const budget = summary?.summary?.budget;
    const budgetLine = budget
      ? `<br><br>${lineRemaining(summary?.summary)}<br><br>`
      : '';
    const limitLines = formatExpenseBudgetLimitLines(
      addedExpense,
      budgetLimitSummaries
    );

    const inAppMessage =
      `Добавлено: ${amount} € - ${this.categoryName(categoryName)}<br><br>` +
      `Сегодня по категории: ${todaysAmountByCategory} €<br><br>` +
      `За месяц по категории: ${monthlyAmountByCategory} €<br><br>` +
      `Всего за месяц: ${monthlyTotal} €` +
      budgetLine +
      (limitLines ? `${limitLines}` : '');

    this.notificationService.showMessage(inAppMessage, 'info', {
      context: 'expense-added',
      expense: addedExpense
        ? { ...addedExpense }
        : {
            category: categoryName,
            amount,
            description: originalDescription || undefined,
            date: Date.now(),
          },
    });
  }

  private categoryName(id: string): string {
    return this.categoriesById.get(id)?.name || `Unknown category (${id})`;
  }

  onSendBrowserNotification() {
    if (this.notificationService.summaryBuildResultCache) {
      this.expenseSummaryService
        .sendBrowserNotificationByBudgetSummary(
          this.notificationService.summaryBuildResultCache
        )
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
      this.notificationService.summaryBuildResultCache = null;
    } else {
      this.expenseSummaryService
        .sendBrowserNotificationWithBudgetSummary()
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
    }
  }

  private getTodaysAmount(categoryName: string): number {
    return this.todaysExpenses
      .filter(expense => expense.category === categoryName)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getMonthlyAmountByCategory(categoryName: string): number {
    return this.monthlyExpenses
      .filter(expense => expense.category === categoryName)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getMonthlyAmount(): number {
    return this.monthlyExpenses.reduce(
      (total, expense) => this.roundUp(total + expense.amount),
      0
    );
  }

  private calculateAmounts(expenses: Expense[]): void {
    this.monthlyExpenses = [...expenses];
    let newAmount = 0;
    let newBalanceAmount = 0;
    this.todaysExpenses = [];
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    expenses
      .filter((expense: Expense) => expense.date >= startOfDay)
      .forEach((expense: Expense) => {
        this.todaysExpenses.push(expense);
        newAmount = this.roundUp(newAmount + expense.amount);
        if (expense?.includeInBalance) {
          newBalanceAmount = this.roundUp(newBalanceAmount + expense.amount);
        }
      });
    this.currentAmount = newAmount;
    this.currentBalanceAmount = newBalanceAmount;
    // Could be reused for subsequent refresh flows if implemented
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }

  onLatestExpenseUpdated(updated: Expense): void {
    this.expenseService
      .updateExpense(updated)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }

  onLatestExpenseDeleted(expense: Expense): void {
    if (!expense?.id) {
      return;
    }
    if (confirm('Delete?')) {
      this.expenseService
        .deleteExpense(expense.id)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
    }
  }

  // Global touch listeners for long press removed
}

export function formatExpenseBudgetLimitLines(
  expense: Pick<Expense, 'category' | 'tagIds'> | undefined,
  summaries: readonly BudgetLimitSummary[]
): string {
  if (!expense) {
    return '';
  }

  const tagIds = new Set(expense.tagIds || []);
  const matchingSummaries = summaries.filter(
    summary =>
      (summary.type === 'category' && summary.targetId === expense.category) ||
      (summary.type === 'tag' && tagIds.has(summary.targetId))
  );
  if (matchingSummaries.length === 0) {
    return '';
  }

  const lines = matchingSummaries.map(summary => {
    const typeLabel = summary.type === 'category' ? 'категории' : 'тега';
    const status = summary.exceeded
      ? `Превышен на ${formatLimitMoney(Math.abs(summary.rawRemaining))} €`
      : `Осталось ${formatLimitMoney(summary.rawRemaining)} €`;
    return `Лимит ${typeLabel} «${escapeNotificationHtml(
      summary.targetLabel
    )}»: <br>${formatLimitMoney(summary.spent)} / ${formatLimitMoney(
      summary.budget
    )} € · ${status} (${formatLimitMoney(summary.percentUsed)}%)`;
  });

  return `<strong>Лимиты бюджета:</strong><br>${lines.join('<br>')}`;
}

function formatLimitMoney(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return String(Math.round(value * 100) / 100);
}

function escapeNotificationHtml(value: string): string {
  return value.replace(/[&<>'"]/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}
