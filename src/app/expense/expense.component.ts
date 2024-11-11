import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

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

  currency: Currency;
  description: string = '';

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private balanceDateService: BalanceDateService,
    private dateFilterService: DateFilterService
  ) {}

  ngOnInit(): void {
    this.expenseService
      .getExpenses(this.dateFilterService.getInitialDayValue())
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
          takeUntil(this.unsubscribe)
        )
        .subscribe(() => {
          this.onShowNumberBoard();
          this.notificationService.showMessage(
            `Добавлено: ${getCategoryNameById(categoryName)}, ${amount} €
          (${this.currentAmount}€)`
          );
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

  private calculateAmounts(expenses: Expense[]): void {
    let newAmount = 0;
    let newBalanceAmount = 0;
    expenses.forEach((expense: Expense) => {
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
}
