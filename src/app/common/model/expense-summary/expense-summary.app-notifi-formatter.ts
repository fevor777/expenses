// Application (in-app toast) budget info message formatter.
// Mirrors the architectural separation used by browser notification formatter.

// Accept full summary snapshot only; derive all fields internally.
export function composeAppBudgetInfoMessage(summary: any): string {
  if (!summary) return '';
  const monthlyBudget = summary.budget || 0;
  const irregularSpent = summary.periodIrregular;
  const remaining = summary.remaining;
  const percentUsed = summary.percentUsed;
  const percentRemaining = summary.percentLeft !== undefined ? summary.percentLeft : Math.max(0, 100 - percentUsed);
  const monthlyTotal = summary.frameTotal;

  // Structure kept identical to previous inline version for continuity.
  const extraLine = summary.extra !== undefined ? `<br>Экстра: ${summary.extra}€` : '';

  return (
    `Нерегулярные расходы:<br>` +
    `Бюджет: ${monthlyBudget} €<br>` +
    `<span style="display:block;margin:6px 0;height:1px;background:var(--color-border);"></span>` +
    `Потрачено: ${irregularSpent} € (${percentUsed.toFixed(1)}%)<br>` +
    `Осталось: ${remaining.toFixed(2)} € (${percentRemaining.toFixed(1)}%)<hr>` +
    `Всего потрачено за месяц: ${monthlyTotal} €` +
    extraLine
  );
}
