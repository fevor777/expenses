import {
  type resolveDateRangePatternSchema,
  type relativeDateRangeTypeSchema,
} from './schemas.js';

const DAY_MS = 24 * 60 * 60 * 1000;

type ResolveDateRangePattern = typeof resolveDateRangePatternSchema['_type'];
type RelativeDateRangeType = typeof relativeDateRangeTypeSchema['_type'];

export type ResolveDateRangeInput = {
  pattern: ResolveDateRangePattern;
  relativeType?: RelativeDateRangeType;
  startDateLocal?: string;
  endDateLocal?: string;
  timezone?: string;
  startDate?: number;
  endDate?: number;
};

export type ResolvedDateRange = {
  pattern: ResolveDateRangePattern;
  startDate: number;
  endDate: number;
  startDateLocal: string;
  endDateLocal: string;
  timezone?: string;
  periodDays: number;
  rangeDisplay: string;
  patternMetadata?: Record<string, unknown>;
};

type LocalDateParts = {
  year: number;
  month: number;
  day: number;
};

type ZonedDateParts = LocalDateParts & {
  hour: number;
  minute: number;
  second: number;
};

export function resolveDateRange(input: ResolveDateRangeInput): ResolvedDateRange {
  switch (input.pattern) {
    case 'relative':
      return resolveRelativeDateRange(input);
    case 'calendar_range':
      return resolveCalendarRange(input);
    case 'absolute':
      return resolveAbsoluteRange(input);
    default:
      throw new Error('Invalid resolve_date_range input: unsupported pattern');
  }
}

function resolveRelativeDateRange(
  input: ResolveDateRangeInput
): ResolvedDateRange {
  const relativeType = input.relativeType;
  const timezone = requireTimezone(input.timezone, 'relative');

  if (!relativeType) {
    throw new Error(
      'Invalid resolve_date_range input: relativeType is required when pattern is relative'
    );
  }

  const today = getCurrentLocalDate(timezone);
  let startLocal: LocalDateParts;
  let endLocal: LocalDateParts;

  switch (relativeType) {
    case 'today':
      startLocal = today;
      endLocal = today;
      break;
    case 'yesterday': {
      const yesterday = addLocalDays(today, -1);
      startLocal = yesterday;
      endLocal = yesterday;
      break;
    }
    case 'this_week':
      startLocal = startOfWeek(today);
      endLocal = today;
      break;
    case 'last_week': {
      const thisWeekStart = startOfWeek(today);
      startLocal = addLocalDays(thisWeekStart, -7);
      endLocal = addLocalDays(thisWeekStart, -1);
      break;
    }
    case 'this_month':
      startLocal = startOfMonth(today);
      endLocal = today;
      break;
    case 'last_month': {
      startLocal = startOfPreviousMonth(today);
      endLocal = endOfMonth(startLocal);
      break;
    }
    case 'last_7_days':
      startLocal = addLocalDays(today, -6);
      endLocal = today;
      break;
    case 'last_30_days':
      startLocal = addLocalDays(today, -29);
      endLocal = today;
      break;
    case 'last_90_days':
      startLocal = addLocalDays(today, -89);
      endLocal = today;
      break;
    case 'year_to_date':
      startLocal = { year: today.year, month: 1, day: 1 };
      endLocal = today;
      break;
  }

  return buildResolvedRange(
    'relative',
    startLocal,
    endLocal,
    timezone,
    { relativeType }
  );
}

function resolveCalendarRange(input: ResolveDateRangeInput): ResolvedDateRange {
  const startDateLocal = input.startDateLocal;
  const endDateLocal = input.endDateLocal;
  const timezone = requireTimezone(input.timezone, 'calendar_range');

  if (!startDateLocal) {
    throw new Error(
      'Invalid resolve_date_range input: startDateLocal is required when pattern is calendar_range'
    );
  }

  if (!endDateLocal) {
    throw new Error(
      'Invalid resolve_date_range input: endDateLocal is required when pattern is calendar_range'
    );
  }

  const startLocal = parseLocalDate(startDateLocal, 'startDateLocal');
  const endLocal = parseLocalDate(endDateLocal, 'endDateLocal');

  return buildResolvedRange(
    'calendar_range',
    startLocal,
    endLocal,
    timezone,
    { startDateLocal, endDateLocal }
  );
}

function resolveAbsoluteRange(input: ResolveDateRangeInput): ResolvedDateRange {
  const startDate = input.startDate;
  const endDate = input.endDate;
  const timezone = input.timezone?.trim() || undefined;

  if (startDate === undefined) {
    throw new Error(
      'Invalid resolve_date_range input: startDate is required when pattern is absolute'
    );
  }

  if (endDate === undefined) {
    throw new Error(
      'Invalid resolve_date_range input: endDate is required when pattern is absolute'
    );
  }

  if (startDate > endDate) {
    throw new Error(
      'Invalid resolve_date_range input: startDate must be less than or equal to endDate'
    );
  }

  if (timezone) {
    assertValidTimeZone(timezone);
  }

  const effectiveTimezone = timezone || 'UTC';
  const startParts = getZonedParts(startDate, effectiveTimezone);
  const endParts = getZonedParts(endDate, effectiveTimezone);

  return {
    pattern: 'absolute',
    startDate,
    endDate,
    startDateLocal: formatLocalDate(startParts),
    endDateLocal: formatLocalDate(endParts),
    ...(timezone ? { timezone } : {}),
    periodDays: diffLocalDays(
      {
        year: startParts.year,
        month: startParts.month,
        day: startParts.day,
      },
      {
        year: endParts.year,
        month: endParts.month,
        day: endParts.day,
      }
    ) + 1,
    rangeDisplay: buildRangeDisplay(
      formatLocalDate(startParts),
      formatLocalDate(endParts),
      timezone
    ),
    patternMetadata: {
      mode: 'absolute',
    },
  };
}

function buildResolvedRange(
  pattern: ResolveDateRangePattern,
  startLocal: LocalDateParts,
  endLocal: LocalDateParts,
  timezone: string,
  patternMetadata?: Record<string, unknown>
): ResolvedDateRange {
  assertValidTimeZone(timezone);

  const startDate = zonedDateTimeToUtcMs(startLocal, timezone, 'start');
  const endDate = zonedDateTimeToUtcMs(endLocal, timezone, 'end');

  if (startDate > endDate) {
    throw new Error(
      'Invalid resolve_date_range input: startDate must be less than or equal to endDate'
    );
  }

  const startDateLocal = formatLocalDate(startLocal);
  const endDateLocal = formatLocalDate(endLocal);

  return {
    pattern,
    startDate,
    endDate,
    startDateLocal,
    endDateLocal,
    timezone,
    periodDays: diffLocalDays(startLocal, endLocal) + 1,
    rangeDisplay: buildRangeDisplay(startDateLocal, endDateLocal, timezone),
    ...(patternMetadata ? { patternMetadata } : {}),
  };
}

function requireTimezone(
  timezone: string | undefined,
  pattern: 'relative' | 'calendar_range'
): string {
  const value = timezone?.trim();
  if (!value) {
    throw new Error(
      `Invalid resolve_date_range input: timezone is required when pattern is ${pattern}`
    );
  }

  assertValidTimeZone(value);
  return value;
}

function parseLocalDate(
  value: string,
  field: 'startDateLocal' | 'endDateLocal'
): LocalDateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value);
  if (!match) {
    throw new Error(
      `Invalid resolve_date_range input: ${field} must use YYYY-MM-DD`
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    throw new Error(
      `Invalid resolve_date_range input: ${field} must be a real calendar date`
    );
  }

  return { year, month, day };
}

function getCurrentLocalDate(timezone: string): LocalDateParts {
  const parts = getZonedParts(Date.now(), timezone);
  return {
    year: parts.year,
    month: parts.month,
    day: parts.day,
  };
}

function getZonedParts(epochMs: number, timezone: string): ZonedDateParts {
  assertValidTimeZone(timezone);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });

  const values = Object.fromEntries(
    formatter
      .formatToParts(new Date(epochMs))
      .filter(part =>
        part.type === 'year' ||
        part.type === 'month' ||
        part.type === 'day' ||
        part.type === 'hour' ||
        part.type === 'minute' ||
        part.type === 'second'
      )
      .map(part => [part.type, Number(part.value)])
  ) as Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', number>;

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function zonedDateTimeToUtcMs(
  date: LocalDateParts,
  timezone: string,
  boundary: 'start' | 'end'
): number {
  const desiredHour = boundary === 'start' ? 0 : 23;
  const desiredMinute = boundary === 'start' ? 0 : 59;
  const desiredSecond = boundary === 'start' ? 0 : 59;
  const desiredAsUtc = Date.UTC(
    date.year,
    date.month - 1,
    date.day,
    desiredHour,
    desiredMinute,
    desiredSecond,
    0
  );

  let candidate = desiredAsUtc;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const actual = getZonedParts(candidate, timezone);
    const actualAsUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
      0
    );
    const delta = desiredAsUtc - actualAsUtc;
    if (delta === 0) {
      return boundary === 'end' ? candidate + 999 : candidate;
    }
    candidate += delta;
  }

  const resolved = getZonedParts(candidate, timezone);
  if (
    resolved.year !== date.year ||
    resolved.month !== date.month ||
    resolved.day !== date.day ||
    resolved.hour !== desiredHour ||
    resolved.minute !== desiredMinute ||
    resolved.second !== desiredSecond
  ) {
    throw new Error(
      'Invalid resolve_date_range input: could not resolve date in the requested timezone'
    );
  }

  return boundary === 'end' ? candidate + 999 : candidate;
}

function addLocalDays(date: LocalDateParts, deltaDays: number): LocalDateParts {
  const value = new Date(Date.UTC(date.year, date.month - 1, date.day + deltaDays));
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate(),
  };
}

function startOfWeek(date: LocalDateParts): LocalDateParts {
  const weekday = new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday;
  return addLocalDays(date, diffToMonday);
}

function startOfMonth(date: LocalDateParts): LocalDateParts {
  return {
    year: date.year,
    month: date.month,
    day: 1,
  };
}

function startOfPreviousMonth(date: LocalDateParts): LocalDateParts {
  if (date.month === 1) {
    return { year: date.year - 1, month: 12, day: 1 };
  }

  return { year: date.year, month: date.month - 1, day: 1 };
}

function endOfMonth(date: LocalDateParts): LocalDateParts {
  const nextMonth = new Date(Date.UTC(date.year, date.month, 0));
  return {
    year: nextMonth.getUTCFullYear(),
    month: nextMonth.getUTCMonth() + 1,
    day: nextMonth.getUTCDate(),
  };
}

function diffLocalDays(start: LocalDateParts, end: LocalDateParts): number {
  const startUtc = Date.UTC(start.year, start.month - 1, start.day);
  const endUtc = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((endUtc - startUtc) / DAY_MS);
}

function formatLocalDate(date: LocalDateParts): string {
  return `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(
    2,
    '0'
  )}-${String(date.day).padStart(2, '0')}`;
}

function buildRangeDisplay(
  startDateLocal: string,
  endDateLocal: string,
  timezone?: string
): string {
  const base =
    startDateLocal === endDateLocal
      ? startDateLocal
      : `${startDateLocal} - ${endDateLocal}`;

  return timezone ? `${base} (${timezone})` : base;
}

function assertValidTimeZone(timezone: string): void {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
  } catch {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}