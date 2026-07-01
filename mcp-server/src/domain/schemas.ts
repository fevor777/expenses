import { z } from 'zod';
import { CATEGORY_DEFINITIONS } from './models.js';

const categoryIds = CATEGORY_DEFINITIONS.map(category => category.id) as [
  (typeof CATEGORY_DEFINITIONS)[number]['id'],
  ...(typeof CATEGORY_DEFINITIONS)[number]['id'][]
];

export const categoryIdSchema = z.enum(categoryIds);

export const noInputShape = {};

export const noInputSchema = z.object(noInputShape).strict();

export const expenseFilterShape = {
  startDate: z.number().int().nonnegative().optional(),
  endDate: z.number().int().nonnegative().optional(),
  categories: z.array(categoryIdSchema).min(1).max(10).optional(),
  description: z.string().trim().max(500).optional(),
  tagIds: z.array(z.string().trim().min(1)).min(1).max(20).optional(),
  limit: z.number().int().min(1).max(500).optional(),
  sort: z.enum(['asc', 'desc']).optional(),
};

export const expenseFilterSchema = z
  .object(expenseFilterShape)
  .strict()
  .refine(
    value =>
      value.startDate === undefined ||
      value.endDate === undefined ||
      value.startDate <= value.endDate,
    'startDate must be less than or equal to endDate'
  );

export const expenseIdShape = {
  id: z.string().trim().min(1),
};

export const expenseIdSchema = z.object(expenseIdShape).strict();

export const createExpenseShape = {
  amount: z.number().positive(),
  category: categoryIdSchema,
  currency: z.string().trim().min(1).max(8).default('EUR').optional(),
  date: z.number().int().nonnegative(),
  description: z.string().trim().max(500).optional(),
  tagIds: z.array(z.string().trim().min(1)).max(20).optional(),
  includeInBalance: z.boolean().optional(),
};

export const createExpenseSchema = z.object(createExpenseShape).strict();

export const updateExpenseShape = {
  id: z.string().trim().min(1),
  amount: z.number().positive().optional(),
  category: categoryIdSchema.optional(),
  currency: z.string().trim().min(1).max(8).optional(),
  date: z.number().int().nonnegative().optional(),
  description: z.string().trim().max(500).optional(),
  tagIds: z.array(z.string().trim().min(1)).max(20).optional(),
  includeInBalance: z.boolean().optional(),
};

export const updateExpenseSchema = z
  .object(updateExpenseShape)
  .strict()
  .refine(
    value =>
      value.amount !== undefined ||
      value.category !== undefined ||
      value.currency !== undefined ||
      value.date !== undefined ||
      value.description !== undefined ||
      value.tagIds !== undefined ||
      value.includeInBalance !== undefined,
    'At least one mutable field must be provided'
  );

export const tagIdShape = {
  id: z.string().trim().min(1),
};

export const tagIdSchema = z.object(tagIdShape).strict();

export const createTagShape = {
  name: z.string().trim().min(1).max(80),
  star: z.boolean().optional(),
};

export const createTagSchema = z.object(createTagShape).strict();

export const updateTagShape = {
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(80).optional(),
  star: z.boolean().optional(),
};

export const updateTagSchema = z
  .object(updateTagShape)
  .strict()
  .refine(value => value.name !== undefined || value.star !== undefined, 'At least one tag field must be provided');

export const listTagsShape = {};

export const listTagsSchema = z.object(listTagsShape).strict();

export const updateBudgetShape = {
  value: z.number().finite().min(0).optional(),
  period: z.number().int().min(1).max(120).optional(),
  periodStartTs: z.number().int().nonnegative().optional(),
  minDayLimit: z.number().finite().min(0).optional(),
};

export const updateBudgetSchema = z
  .object(updateBudgetShape)
  .strict()
  .refine(
    value =>
      value.value !== undefined ||
      value.period !== undefined ||
      value.periodStartTs !== undefined ||
      value.minDayLimit !== undefined,
    'At least one budget field must be provided'
  );

export const savingsValueShape = {
  value: z.number().finite().min(0),
};

export const savingsValueSchema = z.object(savingsValueShape).strict();

export const monthlySummaryShape = {
  includeCategoryBreakdown: z.boolean().optional(),
};

export const monthlySummarySchema = z
  .object(monthlySummaryShape)
  .strict();

export const monthPeriodSummaryShape = {
  year: z.number().int().min(1970).max(3000),
  month: z.number().int().min(1).max(12),
  includeCategoryBreakdown: z.boolean().optional(),
};

export const monthPeriodSummarySchema = z
  .object(monthPeriodSummaryShape)
  .strict();

export const budgetPeriodSummaryShape = {
  includeCategoryBreakdown: z.boolean().optional(),
  periodOffset: z.number().int().min(-24).max(24).optional(),
};

export const budgetPeriodSummarySchema = z
  .object(budgetPeriodSummaryShape)
  .strict();