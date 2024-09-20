import { Component } from '@angular/core';
import { ExpenseService } from '../common/expense.service';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '../common/auth.service';
import { User } from 'firebase/auth';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss'],
})
export class ExportComponent {

  user$: Observable<User>; // Observable to track the logged-in user

  constructor(private expenseService: ExpenseService, private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  // Method to trigger Google Sign-in
  login() {
    this.authService.signInWithGoogle().then(res => {
      console.log('Logged in with Google:', res);
    }).catch(err => {
      console.error('Google Sign-in Error:', err);
    });
  }

  // Method to trigger Sign-out
  logout() {
    this.authService.signOut().then(() => {
      console.log('User logged out');
    });
  }

  exportCSV(): void {
    const data = JSON.parse(localStorage.getItem('expenses') || '[]').map(
      (expense) => ({
        ...expense,
        date: new Date(expense.date).toLocaleDateString(),
      })
    );

    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'exported_data.csv';
    anchor.click();
    window.URL.revokeObjectURL(url);
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
      const responses = data.map((expense) => this.expenseService.addExpense(expense));
      forkJoin(responses).subscribe(() => {
        console.log('Data migrated successfully to Firestore');
      });
    }
  }
}
