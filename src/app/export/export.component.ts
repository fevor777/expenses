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
import { Budget } from '../common/model/budget.model';
import { FormsModule } from '@angular/forms';

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
  ],
})
export class ExportComponent implements OnDestroy {
  activeTab = 'general';
  savings$!: Observable<number>;
  savingsValue: number = 0;
  user$: Observable<User>;
  // Replaced legacy day-of-month anchor with explicit timestamp
  budgetPeriodDuration: number = 1;
  irregularBudgetValue: number = 0;
  // New timestamp-based start (ms). When set, overrides legacy day-of-month logic.
  budgetStartTs?: number;

  // Display-only derived label for current period preview (e.g., "September 5 - October 8")
  get budgetPeriodLabel(): string {
    const periodDays = Math.floor(this.budgetPeriodDuration);
    if (periodDays <= 0 || !this.budgetStartTs) return '';
    const msPerDay = 86400000;
    const start = new Date(this.budgetStartTs);
    const end = new Date(start.getTime() + (periodDays - 1) * msPerDay);
    const fmt = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
    });
    return `${fmt.format(start)} - ${fmt.format(end)}`;
  }

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private irregularBudgetService: IrregularBudgetService,
    private savingService: SavingService,
    private afAuth: AngularFireAuth
  ) {
    this.irregularBudgetService
      .getValue()
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => {
        this.irregularBudgetValue = v?.value || 0;
        this.budgetPeriodDuration = v?.period || 1;
        this.budgetStartTs = v?.periodStartTs;
      });
    this.savings$ = this.savingService.getSavings();
    this.savings$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(v => (this.savingsValue = v || 0));
    this.user$ = this.afAuth.user;
    // Load stored budget start day (balance date). Expecting format like 'YYYY-MM-DD' or empty.
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
    if (!val) {
      this.budgetStartTs = undefined;
      return;
    }
    const parts = val.split('-').map(p => parseInt(p, 10));
    if (parts.length === 3 && !parts.some(isNaN)) {
      const dt = new Date(parts[0], parts[1] - 1, parts[2]);
      this.budgetStartTs = dt.getTime();
    }
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
    };
    this.irregularBudgetService
      .addValue(budget)
      .pipe(first(), takeUntil(this.destroySubject))
      .subscribe();
  }

  // Legacy derivation removed – periodStartTs is now the single source of truth.
}
