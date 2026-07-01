import { z } from 'zod';
import { categoryIdSchema } from './schemas.js';

export const expenseDocumentShape = {
  id: z.string().trim().min(1),
  uid: z.string().trim().min(1),
  amount: z.number().finite(),
  category: categoryIdSchema,
  currency: z.string().trim().min(1).max(8),
  date: z.number().int().nonnegative(),
  description: z.string().trim().max(500).optional(),
  tagIds: z.array(z.string().trim().min(1)).optional(),
  includeInBalance: z.boolean(),
};

export const expenseDocumentSchema = z.object(expenseDocumentShape).strict();

export const tagDocumentShape = {
  id: z.string().trim().min(1),
  uid: z.string().trim().min(1),
  name: z.string().trim().min(1).max(80),
  normalizedName: z.string().trim().min(1).max(80),
  star: z.boolean(),
};

export const tagDocumentSchema = z.object(tagDocumentShape).strict();

export const budgetDocumentShape = {
  uid: z.string().trim().min(1).optional(),
  value: z.number().finite().min(0),
  period: z.number().int().min(1).max(120),
  periodStartTs: z.number().int().nonnegative().optional(),
  minDayLimit: z.number().finite().min(0).optional(),
};

export const budgetDocumentSchema = z.object(budgetDocumentShape).strict();

export const categoryDefinitionShape = {
  id: categoryIdSchema,
  name: z.string().trim().min(1),
  includeInBalance: z.boolean(),
};

export const categoryDefinitionSchema = z.object(categoryDefinitionShape).strict();

export const normalizedExpenseFilterShape = {
  startDate: z.number().int().nonnegative().optional(),
  endDate: z.number().int().nonnegative().optional(),
  categories: z.array(categoryIdSchema),
  description: z.string().trim().max(500).optional(),
  tagIds: z.array(z.string().trim().min(1)),
  limit: z.number().int().min(1),
  sort: z.enum(['asc', 'desc']),
};

export const normalizedExpenseFilterSchema = z
  .object(normalizedExpenseFilterShape)
  .strict()
  .refine(
    value =>
      value.startDate === undefined ||
      value.endDate === undefined ||
      value.startDate <= value.endDate,
    'startDate must be less than or equal to endDate'
  );

export const expenseCollectionResultShape = {
  filter: normalizedExpenseFilterSchema,
  count: z.number().int().min(0),
  expenses: z.array(expenseDocumentSchema),
};

export const expenseCollectionResultSchema = z
  .object(expenseCollectionResultShape)
  .strict();

export const expenseResultSchema = z
  .object({
    expense: expenseDocumentSchema,
  })
  .strict();

export const createExpenseResultSchema = z
  .object({
    status: z.literal('created'),
    id: z.string().trim().min(1),
    expense: expenseDocumentSchema,
  })
  .strict();

export const updateExpenseResultSchema = z
  .object({
    status: z.literal('updated'),
    id: z.string().trim().min(1),
    expense: expenseDocumentSchema,
  })
  .strict();

export const deleteExpenseResultSchema = z
  .object({
    status: z.literal('deleted'),
    id: z.string().trim().min(1),
  })
  .strict();

export const tagCollectionResultSchema = z
  .object({
    count: z.number().int().min(0),
    tags: z.array(tagDocumentSchema),
  })
  .strict();

export const createTagResultSchema = z
  .object({
    status: z.literal('created'),
    id: z.string().trim().min(1),
    tag: tagDocumentSchema,
  })
  .strict();

export const updateTagResultSchema = z
  .object({
    status: z.literal('updated'),
    id: z.string().trim().min(1),
    tag: tagDocumentSchema,
  })
  .strict();

export const deleteTagResultSchema = z
  .object({
    status: z.literal('deleted'),
    id: z.string().trim().min(1),
  })
  .strict();

export const listCategoriesResultSchema = z
  .object({
    count: z.number().int().min(0),
    categories: z.array(categoryDefinitionSchema),
  })
  .strict();

export const getBudgetResultSchema = z
  .object({
    budget: budgetDocumentSchema,
    usesDefaultBudget: z.boolean(),
  })
  .strict();

export const updateBudgetResultSchema = z
  .object({
    status: z.literal('updated'),
    budget: budgetDocumentSchema,
  })
  .strict();

export const getSavingsResultSchema = z
  .object({
    savings: z.number().finite().min(0),
  })
  .strict();

export const updateSavingsResultSchema = z
  .object({
    status: z.literal('updated'),
    savings: z.number().finite().min(0),
  })
  .strict();

export const budgetCategoryBreakdownItemSchema = z
  .object({
    category: categoryIdSchema,
    total: z.number().finite(),
    irregularSpend: z.number().finite(),
    count: z.number().int().min(0),
  })
  .strict();

export const monthlySummarySchema = z
  .object({
    frameStart: z.number().int().nonnegative(),
    frameFinish: z.number().int().nonnegative(),
    frameDisplay: z.string().trim().min(1),
    budgetValue: z.number().finite(),
    budgetPeriodDays: z.number().int().min(1),
    budgetConfiguredPeriodDays: z.number().int().min(1),
    budgetConfiguredStartTs: z.number().int().nonnegative().optional(),
    totalSpend: z.number().finite(),
    irregularSpend: z.number().finite(),
    budgetedSpend: z.number().finite(),
    budgetCountsIncludeInBalanceOnly: z.boolean(),
    remainingBudget: z.number().finite(),
    savings: z.number().finite(),
    expenseCount: z.number().int().min(0),
    irregularExpenseCount: z.number().int().min(0),
    categoryBreakdown: z.array(budgetCategoryBreakdownItemSchema).optional(),
  })
  .strict();

export const expenseCategoryBreakdownItemSchema = z
  .object({
    category: categoryIdSchema,
    total: z.number().finite(),
    count: z.number().int().min(0),
  })
  .strict();

export const monthlyExpenseSummarySchema = z
  .object({
    frameStart: z.number().int().nonnegative(),
    frameFinish: z.number().int().nonnegative(),
    frameDisplay: z.string().trim().min(1),
    totalSpend: z.number().finite(),
    expenseCount: z.number().int().min(0),
    categoryBreakdown: z.array(expenseCategoryBreakdownItemSchema).optional(),
  })
  .strict();

export const budgetSummaryResultSchema = z
  .object({
    summary: monthlySummarySchema,
  })
  .strict();

export const budgetPeriodSummaryResultSchema = z
  .object({
    periodOffset: z.number().int().min(-24).max(24),
    summary: monthlySummarySchema,
  })
  .strict();

export const monthSummaryResultSchema = z
  .object({
    summary: monthlyExpenseSummarySchema,
  })
  .strict();

export const monthPeriodSummaryResultSchema = z
  .object({
    year: z.number().int().min(1970).max(3000),
    month: z.number().int().min(1).max(12),
    summary: monthlyExpenseSummarySchema,
  })
  .strict();