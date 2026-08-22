import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, shareReplay } from 'rxjs';

import { ResolvedCategory } from '../model/category.model';
import {
  Budget,
  BudgetLimitRule,
  BudgetLimitSummary,
  canonicalizeBudget,
} from '../model/budget.model';
import { Expense } from '../model/expense.model';
import { Tag } from '../model/tag.model';
import { DateFrame } from '../component/filter/date/dateFrame.model';
import { BudgetDataService } from './budget-data.service';
import { CategoryService } from './category.service';
import { TagService } from './tag.service';

export type BudgetLimitSummaryContext = {
  budget: Budget;
  dateFrame: DateFrame;
  expenses: Expense[];
  categories: ResolvedCategory[];
  tags: Tag[];
  limitSummaries: BudgetLimitSummary[];
};

@Injectable({ providedIn: 'root' })
export class BudgetLimitSummaryService {
  constructor(
    private budgetDataService: BudgetDataService,
    private categoryService: CategoryService,
    private tagService: TagService
  ) {}

  getCurrentLimitSummaries(): Observable<BudgetLimitSummary[]> {
    return this.getCurrentBudgetWithLimitSummaries().pipe(
      map(result => result.limitSummaries)
    );
  }

  getCurrentBudgetWithLimitSummaries(): Observable<BudgetLimitSummaryContext> {
    return combineLatest([
      this.budgetDataService.getExpensesWithBudget(),
      this.categoryService.getAllCategories(),
      this.tagService.getTags(),
    ]).pipe(
      map(([rolling, categories, tags]) => {
        const budget = canonicalizeBudget(rolling.budget);
        return {
          budget,
          dateFrame: rolling.dateFrame,
          expenses: rolling.expenses,
          categories,
          tags,
          limitSummaries: buildBudgetLimitSummaries(
            budget,
            rolling.expenses,
            categories,
            tags
          ),
        };
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}

export function buildBudgetLimitSummaries(
  budget: Budget | null | undefined,
  expenses: readonly Expense[],
  categories: readonly ResolvedCategory[],
  tags: readonly Tag[]
): BudgetLimitSummary[] {
  const canonicalBudget = canonicalizeBudget(budget);
  const limits = canonicalBudget.limits;
  if (!limits?.length) {
    return [];
  }

  const categoryTotals = new Map<string, { spent: number; expenseCount: number }>();
  const tagTotals = new Map<string, { spent: number; expenseCount: number }>();
  const categoryById = new Map(categories.map(category => [category.id, category] as const));
  const tagById = new Map(tags.map(tag => [tag.id || '', tag] as const));

  for (const expense of expenses) {
    if (expense?.includeInBalance !== true) {
      continue;
    }

    accumulateLimitMetric(categoryTotals, expense.category, expense.amount || 0);

    for (const tagId of expense.tagIds || []) {
      accumulateLimitMetric(tagTotals, tagId, expense.amount || 0);
    }
  }

  return limits.map(limit =>
    buildBudgetLimitSummary(limit, categoryTotals, tagTotals, categoryById, tagById)
  );
}

function buildBudgetLimitSummary(
  limit: BudgetLimitRule,
  categoryTotals: Map<string, { spent: number; expenseCount: number }>,
  tagTotals: Map<string, { spent: number; expenseCount: number }>,
  categoryById: Map<string, ResolvedCategory>,
  tagById: Map<string, Tag | undefined>
): BudgetLimitSummary {
  const sourceTotals =
    limit.type === 'category' ? categoryTotals.get(limit.targetId) : tagTotals.get(limit.targetId);
  const spent = roundMoney(sourceTotals?.spent || 0);
  const rawRemaining = roundMoney(limit.value - spent);
  const remaining = rawRemaining > 0 ? rawRemaining : 0;
  const exceeded = spent > limit.value;
  const percentUsed =
    limit.value <= 0
      ? spent > 0
        ? 100
        : 0
      : Math.min(100, roundMoney((spent / limit.value) * 100));

  if (limit.type === 'category') {
    const category = categoryById.get(limit.targetId);
    const orphaned = !category || category.hidden === true;
    return {
      id: limit.id,
      type: limit.type,
      targetId: limit.targetId,
      targetLabel: category?.name || `Unknown category (${limit.targetId})`,
      orphaned,
      budget: limit.value,
      spent,
      remaining,
      rawRemaining,
      percentUsed,
      expenseCount: sourceTotals?.expenseCount || 0,
      exceeded,
    };
  }

  const tag = tagById.get(limit.targetId);
  return {
    id: limit.id,
    type: limit.type,
    targetId: limit.targetId,
    targetLabel: tag?.name || `Deleted tag (${limit.targetId})`,
    orphaned: !tag,
    budget: limit.value,
    spent,
    remaining,
    rawRemaining,
    percentUsed,
    expenseCount: sourceTotals?.expenseCount || 0,
    exceeded,
  };
}

function accumulateLimitMetric(
  totals: Map<string, { spent: number; expenseCount: number }>,
  targetId: string | undefined,
  amount: number
): void {
  if (!targetId) {
    return;
  }

  const current = totals.get(targetId) || { spent: 0, expenseCount: 0 };
  current.spent = roundMoney(current.spent + amount);
  current.expenseCount += 1;
  totals.set(targetId, current);
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
