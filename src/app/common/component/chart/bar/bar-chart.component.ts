import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import { Expense } from '../../../expense.model';
import { DateFrame, Mode } from '../../filter/date/dateFrame.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  standalone: true,
  imports: [BaseChartDirective],
})
export class BarChartComponent implements OnChanges {
  @Input() expenses: Expense[];
  @Input() filter?: DateFrame;

  chartOptions: any = {
    datasets: [
      {
        data: [1],
        label: 'Expenses',
      },
    ],
    labels: ['1'],
    options: {
      responsive: true,
    },
    colors: [
      {
        borderColor: 'black',
        backgroundColor: 'rgba(255,0,0,0.3)',
      },
    ],
    legend: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenses'] || changes['currentFilter']) {
      this.calculateChartData(this.expenses, this.filter);
    }
  }

  calculateChartData(expenses: Expense[], filter: DateFrame): void {
    if (filter && Array.isArray(expenses)) {
      if (!filter.mode || filter.mode === Mode.DAY) {
        this.chartOptions.labels = new Array(24).fill(0).map((_, i) => {
          return i + ':00';
        });
        this.chartOptions.datasets[0].data = new Array(24).fill(0);

        //data on hours after current make null
        for (let i = new Date().getHours(); i < 24; i++) {
          this.chartOptions.datasets[0].data[i] = null;
        }
      }

      if (filter.mode === Mode.WEEK) {
        this.chartOptions.labels = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        this.chartOptions.datasets[0].data = new Array(7).fill(0);

        //data on days after current make null
        for (let i = new Date().getDay(); i < 7; i++) {
          this.chartOptions.datasets[0].data[i] = null;
        }
      }

      if (filter.mode === Mode.MONTH) {
        this.chartOptions.labels = new Array(31).fill(0).map((_, i) => {
          return i + 1;
        });
        this.chartOptions.datasets[0].data = new Array(31).fill(0);

        //data on days after current make null
        for (let i = new Date().getDate(); i < 31; i++) {
          this.chartOptions.datasets[0].data[i] = null;
        }
      }

      if (filter.mode === Mode.YEAR) {
        this.chartOptions.labels = [
          'янв.',
          'фев.',
          'март',
          'апр.',
          'май',
          'июнь',
          'июль',
          'авг.',
          'сен.',
          'окт.',
          'нояб.',
          'дек.',
        ];
        this.chartOptions.datasets[0].data = new Array(12).fill(0);
        for (let i = new Date().getMonth(); i < 12; i++) {
          this.chartOptions.datasets[0].data[i] = null;
        }
      }

      expenses.forEach((expense) => {
        //sum data for chart
        if (!filter.mode || filter.mode === Mode.DAY) {
          const hour = new Date(expense.date).getHours();
          this.chartOptions.datasets[0].data[hour] =
            Math.round(
              (this.chartOptions.datasets[0].data[hour] + expense.amount) * 100
            ) / 100;
        }

        if (filter.mode === Mode.WEEK) {
          const day = new Date(expense.date).getDay();
          this.chartOptions.datasets[0].data[day] =
            Math.round(
              (this.chartOptions.datasets[0].data[day] + expense.amount) * 100
            ) / 100;
        }

        if (filter.mode === Mode.MONTH) {
          const day = new Date(expense.date).getDate();
          this.chartOptions.datasets[0].data[day - 1] =
            Math.round(
              (this.chartOptions.datasets[0].data[day - 1] + expense.amount) *
                100
            ) / 100;
        }

        if (filter.mode === Mode.YEAR) {
          const month = new Date(expense.date).getMonth();
          this.chartOptions.datasets[0].data[month] =
            Math.round(
              (this.chartOptions.datasets[0].data[month] + expense.amount) * 100
            ) / 100;
        }
      });

      if (filter.mode === Mode.WEEK) {
        this.chartOptions.labels.push(this.chartOptions.labels.shift());
        this.chartOptions.datasets[0].data.push(
          this.chartOptions.datasets[0].data.shift()
        );

        //make null for sunday if its not sunday
        // if (new Date().getDay() !== 0) {
        //   this.chartOptions.datasets[0].data[6] = null;
        // }
      }

      this.chartOptions = {
        ...this.chartOptions,
        datasets: [...this.chartOptions.datasets],
      };
    }
  }
}
