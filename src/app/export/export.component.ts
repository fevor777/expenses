import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from 'firebase/auth';
import { first, forkJoin, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

import { Expense } from '../common/model/expense.model';
import { AuthService } from '../common/service/auth.service';
import { BalanceService } from '../common/service/balance.service';
import { ExpenseService } from '../common/service/expense.service';
import { BalanceStoreService } from '../common/service/balance-store.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class ExportComponent implements OnDestroy {
  user$: Observable<User>; // Observable to track the logged-in user

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private balanceService: BalanceService,
    private balanceStoreService: BalanceStoreService
  ) {
    this.user$ = this.authService.user$;
  }

  // Method to trigger Google Sign-in
  login() {
    this.authService
      .signInWithGoogle()
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((res) => {
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
      .subscribe((expenses) => {
        if (Array.isArray(expenses) && expenses?.length) {
          const data = expenses.map((exp) => this.formatData(exp));
          this.exportToFile(data);
        }
      });
  }

  convertToCSV(data: any[]): string {
    const array = [Object.keys(data[0])].concat(data);

    return array
      .map((row) => {
        return Object.values(row)
          .map((value) => {
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

  exportFirebase(): void {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]');
    if (data.length > 0) {
      const responses = data
        .map((expense) => ({ ...expense, uid: this.authService.user.uid }))
        .map((expense) => this.expenseService.addExpense(expense));
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
}
