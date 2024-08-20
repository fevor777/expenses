import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    expenses: { category: string; currency: string; amount: number }[] = [];

    ngOnInit(): void {
        this.expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    }
}
