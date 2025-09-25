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
import { BalanceDateService } from '../common/service/balance-date.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TabsContainerComponent, TabComponent],
})
export class ExportComponent implements OnDestroy {
  activeTab = 'general';
  irregularBudget$!: Observable<number>;
  irregularBudgetValue: number = 0;
  savings$!: Observable<number>;
  savingsValue: number = 0;
  user$: Observable<User>;
  budgetStartDay: number = 1; // default fallback

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private irregularBudgetService: IrregularBudgetService,
    private savingService: SavingService,
    private afAuth: AngularFireAuth,
    private balanceDateService: BalanceDateService
  ) {
    this.irregularBudget$ = this.irregularBudgetService.getValue();
    this.irregularBudget$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => (this.irregularBudgetValue = v || 0));
    this.savings$ = this.savingService.getSavings();
    this.savings$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => (this.savingsValue = v || 0));
    this.user$ = this.afAuth.user;
    // Load stored budget start day (balance date). Expecting format like 'YYYY-MM-DD' or empty.
    this.balanceDateService
      .getBalanceDate()
      .pipe(
        first(),
        takeUntil(this.destroySubject)
      )
      .subscribe(v => {
        // If value is a date string parse the day, if numeric use it directly.
        if (!v) return;
        let dayNum: number | undefined;
        if (/^\d+$/.test(v)) {
          dayNum = Number(v);
        } else {
          const d = new Date(v);
            if (!isNaN(d.getTime())) dayNum = d.getDate();
        }
        if (dayNum && dayNum >= 1 && dayNum <= 31) this.budgetStartDay = dayNum;
      });
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
    // const data = JSON.parse(localStorage.getItem('expenses') || '[]').map(
    //   (expense) => this.formatData(expense)
    // );
    // if (data?.length > 0) {
    //   this.exportToFile(data);
    // }

    this.expenseService
      .getExpenses()
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe(expenses => {
        if (Array.isArray(expenses) && expenses?.length) {
          const data = expenses.map(exp => this.formatData(exp));
          this.exportToFile(data);
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

  private formatData(data: Expense): Expense {
    return {
      id: data?.id || '',
      uid: data?.uid || '',
      category: data.category || '',
      amount: data?.amount || 0,
      currency: data?.currency || '',
      date: data.date || 0,
      description: data.description || '',
    };
  }

  private exportToFile(data: any[]): void {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'exported_data.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  onEditIrregularBudget(): void {
    const newVal = prompt(
      'Enter irregular budget',
      this.irregularBudgetValue.toString()
    );
    if (newVal !== null) {
      const num = Number(newVal);
      if (!isNaN(num) && num >= 0) {
        this.irregularBudgetService
          .addValue(num)
          .pipe(first(), takeUntil(this.destroySubject))
          .subscribe();
      }
    }
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

  onBudgetStartDayChange(raw: string | number | null): void {
    const num = Number(raw);
    if (isNaN(num) || num < 1 || num > 31) {
      // revert UI silently (Angular will keep previous value)
      return;
    }
    this.budgetStartDay = num;
  }

  onSaveBudgetStartDay(): void {
    // Explicit user-triggered save (keeps auto-save behavior as well; could remove auto-save if desired).
    if (this.budgetStartDay >= 1 && this.budgetStartDay <= 31) {
      this.balanceDateService
        .addBalanceDate(String(this.budgetStartDay))
        .pipe(first(), takeUntil(this.destroySubject))
        .subscribe();
    }
  }
}
