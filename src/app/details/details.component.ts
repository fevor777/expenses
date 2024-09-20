import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Expense } from '../common/expense.model';
import { getCategoryNameById } from '../common/categories';
import { ExpenseService } from '../common/expense.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
  amountForDay: number = 0;
  amountForMonth: number = 0;
  amountForYear: number = 0;
  backUrl: string = '';
  selectedCategory: string = '';

  private readonly destroySubject: Subject<void> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private expenseService: ExpenseService
  ) {}

  ngOnInit(): void {
    this.initDetails();
  }

  initDetails(): void {
    const categoryId =
      this.activatedRoute.snapshot.queryParamMap.get('category-id');
    this.selectedCategory = getCategoryNameById(categoryId);
    this.backUrl = this.activatedRoute.snapshot.queryParamMap.get('back-url');
    this.expenseService.getExpenses().pipe(takeUntil(this.destroySubject)).subscribe((expenses) => {
      const currentDate = new Date().getDate();
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      expenses.forEach((expense: Expense) => {
        const date = new Date(expense.date);
        const expenseDate = date.getDate();
        const expenseMonth = date.getMonth();
        const expenseYear = date.getFullYear();
        if (categoryId === expense.category) {
          if (
            currentDate === expenseDate &&
            currentMonth === expenseMonth &&
            currentYear === expenseYear
          ) {
            this.amountForDay =
              Math.round((this.amountForDay + expense.amount) * 100) / 100;
          }
          if (currentMonth === expenseMonth && currentYear === expenseYear) {
            this.amountForMonth =
              Math.round((this.amountForMonth + expense.amount) * 100) / 100;
          }
          if (currentYear === expenseYear) {
            this.amountForYear =
              Math.round((this.amountForYear + expense.amount) * 100) / 100;
          }
        }
      });
    });
  }

  touchStartX: number = 0;
  touchStartY: number = 0;
  touchEndX: number = 0;
  touchEndY: number = 0;

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.handleSwipeGesture();
  }

  handleSwipeGesture() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Detect horizontal swipe only if it is more significant than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50) {
        this.navigateBack();
      } else if (deltaX < -50) {
        this.navigateBack();
      }
    }
  }

  navigateBack() {
    this.router.navigate([this.backUrl]);
    // Handle the left swipe action here
  }

  ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }
}
