import { z } from 'zod';
import { CATEGORY_DEFINITIONS } from './models.js';

const categoryIds = CATEGORY_DEFINITIONS.map(category => category.id) as [
  (typeof CATEGORY_DEFINITIONS)[number]['id'],
  ...(typeof CATEGORY_DEFINITIONS)[number]['id'][]
];

export const categoryIdSchema = z.enum(categoryIds);

export const noInputShape = {};

export const noInputSchema = z.object(noInputShape).strict();

export const currentTimeShape = {
  timezone: z
    .string()
    .trim()
    .min(1)
    .describe('Required IANA time zone id such as Europe/Moscow.'),
};

export const currentTimeSchema = z.object(currentTimeShape).strict();

export const resolveDateRangePatternSchema = z.enum([
  'relative',
  'calendar_range',
  'absolute',
]);

export const relativeDateRangeTypeSchema = z.enum([
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'last_7_days',
  'last_30_days',
  'last_90_days',
  'year_to_date',
]);

export const resolveDateRangeShape = {
  pattern: resolveDateRangePatternSchema.describe(
    'Required date range resolution mode. Use relative for named periods, calendar_range for YYYY-MM-DD boundaries, or absolute for existing Unix timestamps in milliseconds.'
  ),
  relativeType: relativeDateRangeTypeSchema
    .optional()
    .describe(
      'Required when pattern is relative. Named period to resolve using the provided timezone.'
    ),
  startDateLocal: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'startDateLocal must use YYYY-MM-DD')
    .optional()
    .describe(
      'Required when pattern is calendar_range. Inclusive local start date formatted as YYYY-MM-DD.'
    ),
  endDateLocal: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/u, 'endDateLocal must use YYYY-MM-DD')
    .optional()
    .describe(
      'Required when pattern is calendar_range. Inclusive local end date formatted as YYYY-MM-DD.'
    ),
  timezone: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      'Required for relative and calendar_range patterns. Provide an IANA time zone id such as Europe/Moscow.'
    ),
  startDate: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Required when pattern is absolute. Inclusive start of the date range as a Unix timestamp in milliseconds.'
    ),
  endDate: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Required when pattern is absolute. Inclusive end of the date range as a Unix timestamp in milliseconds.'
    ),
};

export const resolveDateRangeSchema = z
  .object(resolveDateRangeShape)
  .strict();

export const expenseFilterShape = {
  startDate: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Optional inclusive start of the expense date range as a Unix timestamp in milliseconds.'
    ),
  endDate: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Optional inclusive end of the expense date range as a Unix timestamp in milliseconds. Must be greater than or equal to startDate when both are provided.'
    ),
  categories: z
    .array(categoryIdSchema)
    .min(1)
    .max(10)
    .optional()
    .describe(
      'Optional list of category ids. When provided, only expenses in one of these categories are returned.'
    ),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .describe(
      'Optional case-insensitive substring match against the expense description.'
    ),
  tagIds: z
    .array(z.string().trim().min(1))
    .min(1)
    .max(20)
    .optional()
    .describe(
      'Optional list of tag ids. When provided, only expenses containing at least one of these tags are returned.'
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(500)
    .optional()
    .describe(
      'Optional maximum number of expenses to return. If omitted, the server uses its configured default limit.'
    ),
  sort: z
    .enum(['asc', 'desc'])
    .optional()
    .describe(
      'Optional date sort order. Use asc for oldest first or desc for newest first.'
    ),
};

export const expenseFilterSchema = z
  .object(expenseFilterShape)
  .strict();

export const listExpensesForPeriodShape = {
  ...resolveDateRangeShape,
  categories: expenseFilterShape.categories,
  description: expenseFilterShape.description,
  tagIds: expenseFilterShape.tagIds,
  limit: expenseFilterShape.limit,
  sort: expenseFilterShape.sort,
};

export const listExpensesForPeriodSchema = z
  .object(listExpensesForPeriodShape)
  .strict();

export const expenseIdShape = {
  id: z
    .string()
    .trim()
    .min(1)
    .describe('Expense id to fetch, update, or delete.'),
};

export const expenseIdSchema = z.object(expenseIdShape).strict();

export const createExpenseShape = {
  amount: z
    .number()
    .positive()
    .describe('Required expense amount as a positive number.'),
  category: categoryIdSchema.describe('Required expense category id.'),
  currency: z
    .string()
    .trim()
    .min(1)
    .max(8)
    .default('EUR')
    .optional()
    .describe('Optional currency code. Defaults to EUR when omitted.'),
  date: z
    .number()
    .int()
    .nonnegative()
    .describe('Required expense date as a Unix timestamp in milliseconds.'),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .describe('Optional free-text expense description.'),
  tagIds: z
    .array(z.string().trim().min(1))
    .max(20)
    .optional()
    .describe('Optional list of existing tag ids to attach to the expense.'),
  includeInBalance: z
    .boolean()
    .optional()
    .describe(
      'Optional override for whether this expense counts toward remaining budget calculations.'
    ),
};

export const createExpenseSchema = z.object(createExpenseShape).strict();

export const updateExpenseShape = {
  id: z
    .string()
    .trim()
    .min(1)
    .describe('Required expense id to update.'),
  amount: z
    .number()
    .positive()
    .optional()
    .describe('Optional new expense amount as a positive number.'),
  category: categoryIdSchema
    .optional()
    .describe('Optional new expense category id.'),
  currency: z
    .string()
    .trim()
    .min(1)
    .max(8)
    .optional()
    .describe('Optional new currency code.'),
  date: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe('Optional new expense date as a Unix timestamp in milliseconds.'),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .describe('Optional new free-text expense description.'),
  tagIds: z
    .array(z.string().trim().min(1))
    .max(20)
    .optional()
    .describe(
      'Optional full replacement list of tag ids for the expense. Provide an empty array to clear all tags.'
    ),
  includeInBalance: z
    .boolean()
    .optional()
    .describe(
      'Optional new includeInBalance flag used by budget-based summaries.'
    ),
};

export const updateExpenseSchema = z
  .object(updateExpenseShape)
  .strict();

export const tagIdShape = {
  id: z
    .string()
    .trim()
    .min(1)
    .describe('Tag id to delete.'),
};

export const tagIdSchema = z.object(tagIdShape).strict();

export const createTagShape = {
  name: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .describe('Required tag name.'),
  star: z
    .boolean()
    .optional()
    .describe('Optional star flag. Use true to mark the tag as starred.'),
};

export const createTagSchema = z.object(createTagShape).strict();

export const updateTagShape = {
  id: z
    .string()
    .trim()
    .min(1)
    .describe('Required tag id to update.'),
  name: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .optional()
    .describe('Optional new tag name.'),
  star: z
    .boolean()
    .optional()
    .describe('Optional new star flag for the tag.'),
};

export const updateTagSchema = z
  .object(updateTagShape)
  .strict();

export const listTagsShape = {};

export const listTagsSchema = z.object(listTagsShape).strict();

export const updateBudgetShape = {
  value: z
    .number()
    .finite()
    .min(0)
    .optional()
    .describe('Optional new budget value.'),
  period: z
    .number()
    .int()
    .min(1)
    .max(120)
    .optional()
    .describe('Optional budget period length in days.'),
  periodStartTs: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(
      'Optional budget period anchor date as a Unix timestamp in milliseconds.'
    ),
  timezone: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      'Optional IANA time zone id used to format budget period dates, such as Europe/Sofia.'
    ),
  minDayLimit: z
    .number()
    .finite()
    .min(0)
    .optional()
    .describe('Optional minimum daily budget limit value.'),
};

export const updateBudgetSchema = z
  .object(updateBudgetShape)
  .strict();

export const savingsValueShape = {
  value: z
    .number()
    .finite()
    .min(0)
    .describe('Required savings value. Must be zero or a positive number.'),
};

export const savingsValueSchema = z.object(savingsValueShape).strict();

export const monthlySummaryShape = {
  includeCategoryBreakdown: z
    .boolean()
    .optional()
    .describe(
      'Optional flag. Use true to include per-category totals in the summary.'
    ),
};

export const monthlySummarySchema = z
  .object(monthlySummaryShape)
  .strict();

export const monthPeriodSummaryShape = {
  year: z
    .number()
    .int()
    .min(1970)
    .max(3000)
    .describe('Required calendar year, for example 2026.'),
  month: z
    .number()
    .int()
    .min(1)
    .max(12)
    .describe('Required calendar month number from 1 to 12.'),
  includeCategoryBreakdown: z
    .boolean()
    .optional()
    .describe(
      'Optional flag. Use true to include per-category totals in the summary.'
    ),
};

export const monthPeriodSummarySchema = z
  .object(monthPeriodSummaryShape)
  .strict();

export const budgetPeriodSummaryShape = {
  includeCategoryBreakdown: z
    .boolean()
    .optional()
    .describe(
      'Optional flag. Use true to include per-category totals in the summary.'
    ),
  periodOffset: z
    .number()
    .int()
    .min(-24)
    .max(24)
    .optional()
    .describe(
      'Optional relative budget period offset. Use 0 for the current budget period, -1 for the previous period, and 1 for the next period.'
    ),
};

export const budgetPeriodSummarySchema = z
  .object(budgetPeriodSummaryShape)
  .strict();
