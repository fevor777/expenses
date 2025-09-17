import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  HostListener, // added
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, Subject, switchMap, takeUntil, tap, take } from 'rxjs';

import { CategoriesComponent } from '../common/component/category/categories.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { NotificationService } from '../common/component/notification/notification.service';
import { ExpressionEvaluator } from '../common/expression-evaluator';
import {
  getCategoryById,
  getCategoryNameById,
} from '../common/model/categories';
import { Currency } from '../common/model/currency';
import { Expense } from '../common/model/expense.model';
import { BalanceDateService } from '../common/service/balance-date.service';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { SwipeDirective } from '../common/swipe.directive';
import { ExpenseHeaderComponent } from './header/expense-header.component';
import { ExpenseNumberBoardComponent } from './number-board/expense-number-board.component';
import { IrregularBudgetService } from '../common/service/irregular-budget.service';
import { GLOBAL_LONG_PRESS_DURATION } from '../constants';

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
  ],
})
export class ExpenseComponent implements OnInit, OnDestroy {
  enteredAmount = '';
  currentAmount: number = 0;
  currentBalanceAmount: number = 0;
  currentBalance: number = 0;
  balance$: Observable<number>;
  balanceDate$: Observable<string>;
  showNumberBoard: boolean = true;
  monthlyExpenses: Expense[] = [];
  todaysExpenses: Expense[] = [];

  currency: Currency;
  description: string = '';

  private unsubscribe: Subject<void> = new Subject();

  // Long press while number board is shown (categories component not present)
  private globalLongPressTimeout: any;
  private globalLongPressTriggered = false;
  private readonly GLOBAL_LONG_PRESS_MOVE_TOLERANCE = 10;
  private globalTouchStartX = 0;
  private globalTouchStartY = 0;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private balanceDateService: BalanceDateService,
    private dateFilterService: DateFilterService,
    private irregularBudgetService: IrregularBudgetService,
  ) {}

  ngOnInit(): void {
    this.expenseService
      .getExpenses(this.dateFilterService.getInitialMonthValue())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((expenses) => {
        this.calculateAmounts(expenses);
      });

    this.balanceDate$ = this.balanceDateService.getBalanceDate();

    this.balance$ = this.balanceService
      .getBalance()
      .pipe(tap((balance) => (this.currentBalance = balance)));

    const currencyInLocalStorage = localStorage.getItem('currency');
    if (currencyInLocalStorage) {
      this.currency = JSON.parse(currencyInLocalStorage);
    } else {
      this.currency = {
        code: 'EUR',
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }
  }

  onCategoryClick(categoryName: string) {
    const exchangeRate = this.currency?.exchangeRate || 1;
    const calculatedAmount = ExpressionEvaluator.evaluate(this.enteredAmount);
    const amount = Math.round((calculatedAmount / exchangeRate) * 100) / 100;
    if (amount > 0) {
      const newExpense: Expense = {
        category: categoryName,
        amount: amount,
        currency: this.currency?.code,
        date: Date.now(),
        description: this.description || undefined,
      };
      if (!this.description) {
        delete newExpense.description;
      }
      this.enteredAmount = '';
      this.description = '';
      this.expenseService
        .addExpense(newExpense)
        .pipe(
          switchMap(() => {
            let balanceObs: Observable<number> = of(this.currentBalance);
            if (getCategoryById(categoryName)?.includeInBalance) {
              this.currentBalance =
                Math.round((this.currentBalance - amount) * 100) / 100;
              balanceObs = this.balanceService.addBalance(this.currentBalance);
            }
            return balanceObs;
          }),
          takeUntil(this.unsubscribe),
        )
        .subscribe(() => {
          this.onShowNumberBoard();
          this.showNotification(categoryName, amount);
        });
    }
  }

  onHideNumberBoard(): void {
    this.showNumberBoard = false;
  }

  onShowNumberBoard(): void {
    this.showNumberBoard = true;
  }

  navigateToHistory(): void {
    this.router.navigate(['/history']);
  }

  navigateToStatistics(): void {
    this.router.navigate(['/statistics']);
  }

  navigateToExport(): void {
    this.router.navigate(['/export']);
  }

  navigateToDetails(): void {
    this.router.navigate(['/details']);
  }

  onHeaderBudgetInfoClick(): void {
    // Show budget info notification using irregular budget value (if available) and monthly total expenses.
    // Irregular budget considered monthly budget for this feature.
    this.irregularBudgetService
      .getValue()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((val) => {
        const monthlyBudget = val || 0;
        const monthlySpent = this.getMonthlyIrregularAmount();
        if (!monthlyBudget) {
          this.notificationService.showMessage(
            'Бюджет не установлен',
            'warning',
          );
          return;
        }
        const remaining = Math.max(monthlyBudget - monthlySpent, 0);
        const percentUsed = monthlyBudget
          ? Math.min((monthlySpent / monthlyBudget) * 100, 100)
          : 0;
        const percentRemaining = 100 - percentUsed;
        const msg =
          `Нерегулярные расходы:<br>` +
          `Бюджет: ${monthlyBudget} €<br>` +
          `<span style="display:block;margin:6px 0;height:1px;background:var(--color-border);"></span>` +
          `Потрачено: ${monthlySpent} € (${percentUsed.toFixed(1)}%)<br>` +
          `Осталось: ${remaining.toFixed(2)} € (${percentRemaining.toFixed(1)}%)<hr>` +
          `Всего потрачено за месяц: ${this.getMonthlyAmount()} €`;
        this.notificationService.showMessage(
          msg,
          remaining <= 0 ? 'error' : percentUsed > 80 ? 'warning' : 'info',
        );
      });
  }

  onBalanceChange(balance: number): void {
    this.balanceService
      .addBalance(balance)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => (this.currentBalance = balance));
  }

  onBalanceDateChange(newBalanceDate: string): void {
    this.balanceDateService
      .addBalanceDate(newBalanceDate)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe();
  }

  onAmountChange(amount: string): void {
    this.enteredAmount = amount;
    if (amount) {
      this.notificationService.hide();
    }
  }

  onCurrencyChange(currency: Currency): void {
    this.currency = currency;
    localStorage.setItem('currency', JSON.stringify(this.currency));
  }

  onDescriptionChange(description: string): void {
    this.description = description;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  showNotification(categoryName, amount): void {
    const todaysAmountByCategory = this.getTodaysAmount(categoryName);
    const monthlyAmountByCategory =
      this.getMonthlyAmountByCategory(categoryName);
    const monthlyTotal = this.getMonthlyAmount();
    // Fetch irregular (monthly) budget and append info
    this.irregularBudgetService
      .getValue()
      .pipe(take(1))
      .subscribe((val) => {
        const monthlyBudget = val || 0;
        const irregularSpent = this.getMonthlyIrregularAmount();
        const remaining = Math.max(monthlyBudget - irregularSpent, 0);
        const percentUsed = monthlyBudget
          ? Math.min((irregularSpent / monthlyBudget) * 100, 100)
          : 0;
        const budgetLine = monthlyBudget
          ? `<br><br>Бюджет: ${monthlyBudget} € | Потрачено (учёт): ${irregularSpent} € (${percentUsed.toFixed(1)}%) | Осталось: ${remaining.toFixed(2)} €`
          : '';
        this.notificationService.showMessage(
          `Добавлено: ${amount} € - ${getCategoryNameById(categoryName)}<br><br>` +
            `Сегодня по категории: ${todaysAmountByCategory} €<br><br>` +
            `За месяц по категории: ${monthlyAmountByCategory} €<br><br>` +
            `Всего за месяц: ${monthlyTotal} €` +
            budgetLine,
        );
      });
  }

  private getTodaysAmount(categoryName: string): number {
    return this.todaysExpenses
      .filter((expense) => expense.category === categoryName)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getMonthlyAmountByCategory(categoryName: string): number {
    return this.monthlyExpenses
      .filter((expense) => expense.category === categoryName)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
  }

  private getMonthlyAmount(): number {
    return this.monthlyExpenses.reduce(
      (total, expense) => this.roundUp(total + expense.amount),
      0,
    );
  }

  private getMonthlyIrregularAmount(): number {
    return this.monthlyExpenses
      .filter((expense) => getCategoryById(expense.category)?.includeInBalance)
      .reduce((total, expense) => this.roundUp(total + expense.amount), 0);
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
      today.getDate(),
    ).getTime();
    expenses
      .filter((expense: Expense) => expense.date >= startOfDay)
      .forEach((expense: Expense) => {
        this.todaysExpenses.push(expense);
        newAmount = this.roundUp(newAmount + expense.amount);
        if (
          getCategoryById(expense.category)?.includeInBalance &&
          !expense.isDeletedFromBalance
        ) {
          newBalanceAmount = this.roundUp(newBalanceAmount + expense.amount);
        }
      });
    this.currentAmount = newAmount;
    this.currentBalanceAmount = newBalanceAmount;
  }

  private roundUp(value: number): number {
    return Math.round(value * 100) / 100;
  }

  @HostListener('touchstart', ['$event'])
  onGlobalTouchStart(e: TouchEvent) {
    if (!this.showNumberBoard || this.enteredAmount) return; // categories handle it otherwise
    if (!e.changedTouches.length) return;
    const target = e.target as HTMLElement;
    if (target.closest('.expense-number-board')) return; // ignore number board area

    const t = e.changedTouches[0];
    this.globalTouchStartX = t.screenX;
    this.globalTouchStartY = t.screenY;
    this.globalLongPressTriggered = false;
    clearTimeout(this.globalLongPressTimeout);
    this.globalLongPressTimeout = setTimeout(() => {
      this.globalLongPressTriggered = true;
      // Mimic left swipe on categories => navigate to details
      this.navigateToDetails();
    }, GLOBAL_LONG_PRESS_DURATION);
  }

  @HostListener('touchmove', ['$event'])
  onGlobalTouchMove(e: TouchEvent) {
    if (!this.showNumberBoard || this.enteredAmount) return;
    if (!e.changedTouches.length) return;
    if (this.globalLongPressTriggered) return;
    const t = e.changedTouches[0];
    if (
      Math.abs(t.screenX - this.globalTouchStartX) >
        this.GLOBAL_LONG_PRESS_MOVE_TOLERANCE ||
      Math.abs(t.screenY - this.globalTouchStartY) >
        this.GLOBAL_LONG_PRESS_MOVE_TOLERANCE
    ) {
      clearTimeout(this.globalLongPressTimeout);
    }
  }

  @HostListener('touchend')
  onGlobalTouchEnd() {
    if (!this.showNumberBoard || this.enteredAmount) return;
    clearTimeout(this.globalLongPressTimeout);
  }
}
