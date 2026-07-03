import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getCurrentTimeResultSchema } from '../domain/output-schemas.js';
import { currentTimeSchema } from '../domain/schemas.js';
import type { ToolDependencies } from './shared.js';
import { createReadOnlyAnnotations, executeTool, jsonResult } from './shared.js';

export function registerGetCurrentTimeTool(
  server: McpServer,
  deps: ToolDependencies
): void {
  server.registerTool(
    'get_current_time',
    {
      description:
        'Return the current time formatted for a required IANA time zone. This tool requires a timezone input.',
      inputSchema: currentTimeSchema,
      outputSchema: getCurrentTimeResultSchema,
      annotations: createReadOnlyAnnotations('Time: Current'),
    },
    async input => {
      return executeTool(deps, 'get_current_time', async () => {
        const now = new Date();
        const epochMs = now.getTime();
        const isoUtc = now.toISOString();
        const timezone = input.timezone;
        const formatted = formatDateTimeInTimeZone(now, timezone);

        return jsonResult({
          epochMs,
          isoUtc,
          timezone,
          formatted,
        });
      });
    }
  );
}

function formatDateTimeInTimeZone(date: Date, timezone: string): string {
  assertValidTimeZone(timezone);

  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const values = Object.fromEntries(
    dateParts
      .filter(part =>
        part.type === 'year' ||
        part.type === 'month' ||
        part.type === 'day' ||
        part.type === 'hour' ||
        part.type === 'minute' ||
        part.type === 'second'
      )
      .map(part => [part.type, part.value])
  ) as Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', string>;

  const zonePart = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'short',
  })
    .formatToParts(date)
    .find(part => part.type === 'timeZoneName')?.value;

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second} ${zonePart ?? timezone}`;
}

function assertValidTimeZone(timezone: string): void {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone });
  } catch {
    throw new Error(`Invalid timezone: ${timezone}`);
  }
}