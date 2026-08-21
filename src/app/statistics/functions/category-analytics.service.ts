import { Injectable } from '@angular/core';
import { Expense } from '../../common/model/expense.model';
import { CategoryService } from '../../common/service/category.service';
import { ResolvedCategory } from '../../common/model/category.model';

export interface CategoryAggregate {
  category: string;
  name: string;
  total: number;
  count: number;
  avg: number;
  color?: string;
}

@Injectable({ providedIn: 'root' })
export class CategoryAnalyticsService {
  private categoriesById = new Map<string, ResolvedCategory>();

  constructor(categoryService: CategoryService) {
    categoryService.allCategories$.subscribe(categories => {
      this.categoriesById = new Map(
        categories.map(category => [category.id, category])
      );
    });
  }

  buildAggregates(expenses: Expense[]): CategoryAggregate[] {
    const map: Record<string, CategoryAggregate> = {};
    expenses?.forEach(e => {
      if (!map[e.category]) {
        const category = this.categoriesById.get(e.category);
        map[e.category] = {
          category: e.category,
          name: category?.name || `Unknown category (${e.category})`,
          total: 0,
          count: 0,
          avg: 0,
          color: category?.color,
        };
      }
      const agg = map[e.category];
      agg.total = Math.round((agg.total + e.amount) * 100) / 100;
      agg.count += 1;
    });
    return Object.values(map).map(a => ({
      ...a,
      avg: a.count ? Math.round((a.total / a.count) * 100) / 100 : 0,
    }));
  }

  buildPareto(aggs: CategoryAggregate[]): {
    data: CategoryAggregate[];
    cumulativePercents: number[];
  } {
    const sorted = [...(aggs || [])].sort((a, b) => b.total - a.total);
    const grand = sorted.reduce((s, a) => s + a.total, 0) || 1;
    let run = 0;
    const cum: number[] = [];
    sorted.forEach(a => {
      run += a.total;
      cum.push(Math.round((run / grand) * 10000) / 100);
    });
    return { data: sorted, cumulativePercents: cum };
  }
}
