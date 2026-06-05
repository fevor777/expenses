import { z } from 'zod';
import { CATEGORY_DEFINITIONS } from './models.js';

const categoryIds = CATEGORY_DEFINITIONS.map(category => category.id) as [
  (typeof CATEGORY_DEFINITIONS)[number]['id'],
  ...(typeof CATEGORY_DEFINITIONS)[number]['id'][]
];

export const categoryIdSchema = z.enum(categoryIds);

export const expenseFilterShape = {
  startDate: z.number().int().nonnegative().optional(),
  endDate: z.number().int().nonnegative().optional(),
  categories: z.array(categoryIdSchema).min(1).max(10).optional(),
  description: z.string().trim().max(500).optional(),
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
      value.includeInBalance !== undefined,
    'At least one mutable field must be provided'
  );

export const monthlySummaryShape = {
  includeCategoryBreakdown: z.boolean().optional(),
};

export const monthlySummarySchema = z
  .object(monthlySummaryShape)
  .strict();

export const exportExpensesShape = {
  ...expenseFilterShape,
  format: z.enum(['json']).default('json').optional(),
  includeBudget: z.boolean().optional(),
  includeSavings: z.boolean().optional(),
};

export const exportExpensesSchema = z.object(exportExpensesShape).strict();