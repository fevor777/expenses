import { BudgetLimitSummary } from '../common/model/budget.model';
import { formatExpenseBudgetLimitLines } from './expense.component';

describe('formatExpenseBudgetLimitLines', () => {
  const summaries: BudgetLimitSummary[] = [
    {
      id: 'category:meal',
      type: 'category',
      targetId: 'meal',
      targetLabel: 'Питание',
      orphaned: false,
      budget: 445,
      spent: 273.41,
      remaining: 171.59,
      rawRemaining: 171.59,
      percentUsed: 61.44,
      expenseCount: 39,
      exceeded: false,
    },
    {
      id: 'tag:coffee',
      type: 'tag',
      targetId: 'coffee',
      targetLabel: 'Кофе',
      orphaned: false,
      budget: 50,
      spent: 55,
      remaining: 0,
      rawRemaining: -5,
      percentUsed: 100,
      expenseCount: 8,
      exceeded: true,
    },
    {
      id: 'tag:holiday',
      type: 'tag',
      targetId: 'holiday',
      targetLabel: 'Отпуск',
      orphaned: false,
      budget: 100,
      spent: 10,
      remaining: 90,
      rawRemaining: 90,
      percentUsed: 10,
      expenseCount: 1,
      exceeded: false,
    },
  ];

  it('includes the expense category and assigned tag limits only', () => {
    const message = formatExpenseBudgetLimitLines(
      { category: 'meal', tagIds: ['coffee'] },
      summaries
    );

    expect(message).toContain('Лимит категории «Питание»');
    expect(message).toContain('273.41 / 445 €');
    expect(message).toContain('Лимит тега «Кофе»');
    expect(message).toContain('Превышен на 5 €');
    expect(message).not.toContain('Отпуск');
  });

  it('does not add a section without matching limits', () => {
    expect(
      formatExpenseBudgetLimitLines(
        { category: 'home', tagIds: ['groceries'] },
        summaries
      )
    ).toBe('');
  });
});
