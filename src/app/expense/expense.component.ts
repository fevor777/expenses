import { CommonModule, getCurrencySymbol } from '@angular/common';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

import { CategoriesComponent } from '../common/component/category/categories.component';
import { DateFilterService } from '../common/component/filter/date/date-filter.service';
import { NotificationService } from '../common/component/notification/notification.service';
import { ExpressionEvaluator } from '../common/expression-evaluator';
import {
  Categories,
  Category,
  getCategoryById,
  getCategoryNameById,
} from '../common/model/categories';
import { Currency } from '../common/model/currency';
import { Expense } from '../common/model/expense.model';
import { BalanceDateService } from '../common/service/balance-date.service';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { SwipeDirective } from '../common/swipe.directive';
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
  ],
})
export class ExpenseComponent implements OnInit, AfterViewChecked, OnDestroy {
  enteredAmount = '';
  currentAmount: number = 0;
  currentBalanceAmount: number = 0;
  isShowCurrentBalanceAmount: boolean = false;
  currentBalance: number = 0;
  balance: number = 0;
  balanceDate: string = '';
  showKeyBoard: boolean = true;
  currentDate: string = new Date().toLocaleDateString('ru-RU', {
    weekday: 'short', // 'Thu'
    month: 'short', // 'Aug'
    day: 'numeric', // '12'
  });
  categories: Category[] = Categories;

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

  ngAfterViewChecked(): void {
    this.categoriesVisible = true;
  }

  ngOnInit(): void {
    this.expenseService
      .getExpenses(this.dateFilterService.getInitialDayValue())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((expenses) => {
        this.sumValues(expenses);
      });

    this.balanceDateService
      .getBalanceDate()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((balanceDate) => {
        this.balanceDate = balanceDate;
      });

    this.balance = Number(localStorage.getItem('balance')) || 0;

    const currencyInLocalStorage = localStorage.getItem('currency');
    if (currencyInLocalStorage) {
      this.currency = JSON.parse(currencyInLocalStorage);
    } else {
      this.currency = {
        code: 'EUR',
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }
    const localStorageIsShowCurrentBalanceAmount =
      localStorage.getItem('isShowCurrentBalanceAmount') || 'false';
    this.isShowCurrentBalanceAmount = JSON.parse(
      localStorageIsShowCurrentBalanceAmount
    );
  }

  onCurrentAmountClick(): void {
    this.isShowCurrentBalanceAmount = !this.isShowCurrentBalanceAmount;
    localStorage.setItem(
      'isShowCurrentBalanceAmount',
      this.isShowCurrentBalanceAmount.toString()
    );
  }

  categoriesVisible = false;

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
            let balanceObs: Observable<number> = of(this.balance);
            let newBalance = this.balance;
            if (getCategoryById(categoryName)?.includeInBalance) {
              newBalance = Math.round((this.balance - amount) * 100) / 100;
              this.balance = newBalance;
              balanceObs = this.balanceService.addBalance(newBalance);
            }
            return balanceObs;
          }),
          switchMap(() => {
            return this.expenseService.getExpenses(
              this.dateFilterService.getInitialDayValue()
            );
          }),
          takeUntil(this.unsubscribe)
        )
        .subscribe((expenseList) => {
          this.showKeyBoard = true;
          this.notificationService.showMessage(
            `Добавлено: ${getCategoryNameById(categoryName)}, ${amount} €
          (${this.currentAmount}€)`
          );
          this.sumValues(expenseList);
        });
    }
  }

  ngAfterViewInit(): void {}

  onNumberBoardSwipeDown(): void {
    this.showKeyBoard = false;
  }

  onNumberBoardSwipeLeft(): void {
    this.router.navigate(['/history']);
  }

  onNumberBoardSwipeRight(): void {
    this.router.navigate(['/statistics']);
  }

  onBalanceChange(): void {
    const newBalance = prompt('Enter new balance', this.balance.toString());
    if (newBalance) {
      this.balanceService
        .addBalance(Number(newBalance))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
      this.balance = Number(newBalance);
    }
  }

  onBalanceDateChange(): void {
    const newBalanceDate = prompt(
      'Enter new balance date',
      this.balanceDate || ''
    );
    if (newBalanceDate) {
      this.balanceDateService
        .addBalanceDate(newBalanceDate)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => {
          this.balanceDate = newBalanceDate;
        });
    }
  }

  onSwipeLeft(): void {
    this.router.navigate(['/history']);
  }

  onSwipeRight(): void {
    this.router.navigate(['/statistics']);
  }

  onShowKeyBoard(): void {
    this.showKeyBoard = true;
  }
  onSwipeDown(): void {
    this.showKeyBoard = false;
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

  private sumValues(expenses: Expense[]): void {
    this.currentAmount = 0;
    this.currentBalanceAmount = 0;
    expenses.forEach((expense: Expense) => {
      if (new Date(expense.date).toDateString() === new Date().toDateString()) {
        const currentSum = this.currentAmount + expense.amount;
        this.currentAmount = Math.round(currentSum * 100) / 100;
        if (
          getCategoryById(expense.category)?.includeInBalance &&
          !expense.isDeletedFromBalance
        ) {
          const currentBalanceSum = this.currentBalanceAmount + expense.amount;
          this.currentBalanceAmount = Math.round(currentBalanceSum * 100) / 100;
        }
      }
    });
  }
}
