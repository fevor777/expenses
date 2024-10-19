import { getCurrencySymbol } from '@angular/common';
import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject, switchMap, takeUntil } from 'rxjs';

import { BalanceDateService } from '../common/balance-date.service';
import { BalanceService } from '../common/balance.service';
import { Categories, Category, getCategoryById, getCategoryNameById } from '../common/categories';
import { DateFilterComponent } from '../common/component/filter/date/date-filter.component';
import { NotificationService } from '../common/component/notification/notification.service';
import { Currency } from '../common/currency';
import { Expense } from '../common/expense.model';
import { ExpenseService } from '../common/expense.service';
import { ExpressionEvaluator } from '../common/expression-evaluator';
import { AngularFireFunctions } from '@angular/fire/compat/functions';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
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

  getCurrencySymbol(): string {
    return getCurrencySymbol(this.currency.code, 'narrow');
  }

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private expenseService: ExpenseService,
    private balanceService: BalanceService,
    private balanceDateService: BalanceDateService,
    private functions: AngularFireFunctions
  ) {}

  ngAfterViewChecked(): void {
    this.categoriesVisible = true;
  }

  ngOnInit(): void {
    // const callable = this.functions.httpsCallable('getExpenses');
    // const result$ = callable({});
    // result$.subscribe((res) => {
    //   console.log('result', res);
    // });

    this.expenseService
      .getExpenses(DateFilterComponent.initialValue)
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

  addDescription(): void {
    this.description = prompt('Enter description', this.description);
  }

  onCurrentAmountClick(): void {
    this.isShowCurrentBalanceAmount = !this.isShowCurrentBalanceAmount;
    localStorage.setItem(
      'isShowCurrentBalanceAmount',
      this.isShowCurrentBalanceAmount.toString()
    );
  }

  categoriesVisible = false;

  onNumberClick(numberValue: string) {
    if (numberValue === '.') {
      if (this.enteredAmount.length === 0) {
        this.enteredAmount = '0.';
      } else if (!this.enteredAmount.includes('.')) {
        this.enteredAmount += numberValue;
      }
    } else {
      this.enteredAmount += numberValue;
    }
  }

  onDeleteClick() {
    if (this.enteredAmount.length > 0) {
      this.enteredAmount = this.enteredAmount.slice(0, -1);
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
              DateFilterComponent.initialValue
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

  onDisableRefresh(event: Event): void {
    event.stopPropagation();
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

  onCurrencyClick(): void {
    const newCurrency = prompt('Enter new currency', this.currency.code);
    if (newCurrency) {
      let newExchangeRate = '1';
      if (newCurrency !== 'EUR') {
        newExchangeRate = prompt(
          'Enter exchange rate',
          this.currency?.exchangeRate?.toString() || '1'
        );
      }
      this.currency = {
        code: newCurrency,
        exchangeRate: Number(newExchangeRate),
      };
      localStorage.setItem('currency', JSON.stringify(this.currency));
    }
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
