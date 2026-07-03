const DAY_MS = 24 * 60 * 60 * 1000;
export function normalizePeriodDays(periodDays) {
    const normalized = Math.floor(periodDays || 0);
    return normalized > 0 ? normalized : 1;
}
export function getInclusivePeriodEndMs(startMs, periodDays) {
    return startMs + normalizePeriodDays(periodDays) * DAY_MS - 1;
}
export function formatBudgetPeriodLabel(startMs, periodDays, timeZone) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        ...(timeZone ? { timeZone } : {}),
    });
    const endMs = getInclusivePeriodEndMs(startMs, periodDays);
    return `${formatter.format(new Date(startMs))} - ${formatter.format(new Date(endMs))}`;
}
