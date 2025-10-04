import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PeriodSummaryService } from './period-summary/period-summary.service';
import { PeriodSummary } from './period-summary/period-summary.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class DetailsComponent implements OnInit {
  summaries$: Observable<PeriodSummary[]>;

  constructor(private periodSummaryService: PeriodSummaryService) {}

  ngOnInit(): void {
    // Retrieve snapshot of period narratives. Architecture mirrors pattern of summary services.
    this.summaries$ = this.periodSummaryService.getCurrentSummaries();
  }
}
