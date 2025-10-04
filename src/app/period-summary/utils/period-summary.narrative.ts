import {
  PeriodNarrativeConfig,
  DEFAULT_PERIOD_NARRATIVE_CONFIG,
} from './period-summary.config';
import { PeriodMetricsSnapshot } from './period-summary.types';

export interface PeriodNarrativeResult {
  paragraphs: string[];
}

export function composeNarrative(
  snapshot: PeriodMetricsSnapshot,
  today?: PeriodMetricsSnapshot,
  cfg: PeriodNarrativeConfig = DEFAULT_PERIOD_NARRATIVE_CONFIG
): PeriodNarrativeResult {
  switch (snapshot.frame.key) {
    case 'today':
      return { paragraphs: composeToday(snapshot, cfg) };
    case 'yesterday':
      return { paragraphs: composeYesterday(snapshot, today, cfg) };
    case 'week':
      return { paragraphs: composeWeek(snapshot, cfg) };
    case 'month':
      return { paragraphs: composeMonth(snapshot, cfg) };
    case 'lastMonth':
      // Reuse month narrative; differentiate title already via frame
      return { paragraphs: composeMonth(snapshot, cfg) };
  }
  // Fallback (should not happen if keys exhaustive)
  return { paragraphs: [] };
}

function composeToday(
  s: PeriodMetricsSnapshot,
  cfg: PeriodNarrativeConfig
): string[] {
  if (!s.count) return ['Сегодня расходов нет.'];
  const top = s.categories[0];
  const extraShare = pctShare(s.extraSum, s.total);
  const dominant = top && top.percent > cfg.singleCategoryDominantPct;
  return [
    `Проведено ${s.count} расход${plural(s.count)} на ${money(s.total)}. \n\n Средний чек: ${money(s.avg)}. \n\n Крупнейшая: ${top ? top.name + ' — ' + money(top.amount) : '—'}.`,
    `Структура:\n- Регулярные: ${money(s.regularSum)} (${s.regularCount}).\n- Нерегулярные: ${money(s.irregularSum)} (${s.irregularCount}).`,
    `Особые метки:\n- Extra: ${markBlock(s.extraCount, s.extraSum)}.\n- Ненужные: ${markBlock(s.unnecessaryCount, s.unnecessarySum)}.`,
    `Категории: активных ${s.categories.length}. Топ: ${top ? top.name + ' ' + percent(top.percent) : 'нет'}.`,
    'Вывод: ' +
      (extraShare > cfg.extraHighPct
        ? 'Высокая доля extra.'
        : dominant
          ? 'Сильная концентрация.'
          : 'Структура сбалансирована.'),
  ];
}

function composeYesterday(
  s: PeriodMetricsSnapshot,
  today: PeriodMetricsSnapshot | undefined,
  cfg: PeriodNarrativeConfig
): string[] {
  if (!s.count) return ['Вчера расходов не было.'];
  const top = s.categories[0];
  const paragraphs: string[] = [
    `Проведено ${s.count} расход${plural(s.count)} на ${money(s.total)}. \n\n Средний чек: ${money(s.avg)}. \n\n Крупнейшая: ${top ? top.name + ' — ' + money(top.amount) + ' (' + percent(top.percent) + ')' : '—'}.`,
    `Структура:\n- Регулярные: ${money(s.regularSum)} (${s.regularCount}).\n- Нерегулярные: ${money(s.irregularSum)} (${s.irregularCount}).`,
    `Особые метки:\n- Extra: ${markBlock(s.extraCount, s.extraSum)}.\n- Ненужные: ${markBlock(s.unnecessaryCount, s.unnecessarySum)}.`,
  ];
  if (today) {
    // Варианты:
    // 1) Сегодня нет расходов -> просто сообщаем вчера.
    if (!today.total) {
      paragraphs.push(
        `Сегодня расходов нет; вчера было ${money(s.total)} (${s.count} операц${plural(s.count)}).`
      );
    } else if (!s.total) {
      paragraphs.push(
        `Вчера расходов не было; сегодня уже ${money(today.total)} (${today.count} операц${plural(today.count)}).`
      );
    } else {
      // Считаем насколько сегодняшняя сумма отличается от вчерашней:
      // changeTodayVsYesterday = (today - yesterday)/yesterday * 100
      const changeTodayVsYesterday = ((today.total - s.total) / s.total) * 100;
      const abs = Math.abs(changeTodayVsYesterday);
      if (abs < 0.1) {
        paragraphs.push(
          `Сумма расходов сегодня практически равна вчерашней (≈0%). Операций: вчера ${s.count}, сегодня ${today.count}.`
        );
      } else {
        const dir = changeTodayVsYesterday > 0 ? 'выше' : 'ниже';
        // В контексте блока "Вчера" инвертируем ракурс: вчерашняя сумма на X% ниже/выше сегодняшней.
        const inverted = Math.abs(changeTodayVsYesterday).toFixed(1);
        const dirYesterday = changeTodayVsYesterday > 0 ? 'ниже' : 'выше';
        paragraphs.push(
          `Относительно сегодняшнего дня вчерашняя сумма ${dirYesterday} на ${inverted}%. (Сегодня ${dir} на ${inverted}% относительно вчера). Операции: вчера ${s.count}, сегодня ${today.count}.`
        );
      }
    }
  }
  paragraphs.push(
    `Концентрация: ведущая категория ${top ? top.name + ' ' + percent(top.percent) : 'нет'}.`
  );
  paragraphs.push(
    'Вывод: ' +
      (s.unnecessaryCount
        ? 'Есть ненужные позиции.'
        : 'День выглядел дисциплинированно.')
  );
  return paragraphs;
}

function composeWeek(
  s: PeriodMetricsSnapshot,
  cfg: PeriodNarrativeConfig
): string[] {
  if (!s.count) return ['За текущую неделю расходов пока нет.'];
  const top3 = s.categories.slice(0, 3);
  const unnecessaryShare = pctShare(s.unnecessarySum, s.total);
  // Active days percent (week frame has elapsedDays in frame)
  const activeDaysPct =
    s.activeDays != null && s.frame.elapsedDays
      ? (s.activeDays / s.frame.elapsedDays) * 100
      : undefined;
  return [
    `Проведено ${s.count} расход${plural(s.count)} на ${money(s.total)}. \n\n Средний чек: ${money(s.avg)}.`,
    `Структура:\n- Регулярные: ${money(s.regularSum)} (${s.regularCount}).\n- Нерегулярные: ${money(s.irregularSum)} (${s.irregularCount}).`,
    `Особые метки:\n- Extra: ${markBlock(s.extraCount, s.extraSum)}.\n- Ненужные: ${markBlock(s.unnecessaryCount, s.unnecessarySum)} (${percent(unnecessaryShare)}).`,
    `Категории: активных ${s.categories.length}. Топ-3: ${top3.map(c => `${c.name} ${percent(c.percent)}`).join(', ')}.`,
    `Дней с расходами: ${s.activeDays != null ? s.activeDays : '—'} / ${s.frame.elapsedDays ?? '—'}${
      activeDaysPct != null ? ' (' + percent(activeDaysPct) + ')' : ''
    }.`,
    `Поведенческий сигнал: доля ненужных ${percent(unnecessaryShare)} — ${weekUnnecessaryLabel(unnecessaryShare, cfg)}.`,
  ];
}

function composeMonth(
  s: PeriodMetricsSnapshot,
  cfg: PeriodNarrativeConfig
): string[] {
  if (!s.count) return ['В этом месяце расходов пока нет.'];
  const unnecessaryShare = pctShare(s.unnecessarySum, s.total);
  const top2 = percent(s.top2Concentration || 0);
  const activeDaysPct =
    s.activeDays != null && s.frame.elapsedDays
      ? (s.activeDays / s.frame.elapsedDays) * 100
      : undefined;
  return [
    `Проведено ${s.count} расход${plural(s.count)} на ${money(s.total)}. \n\n Средний чек ≈ ${money(s.avg)}.`,
    `Структура:\n- Регулярные: ${money(s.regularSum)} (${s.regularCount}).\n- Нерегулярные: ${money(s.irregularSum)} (${s.irregularCount}).`,
    `Особые метки:\n- Extra: ${markBlock(s.extraCount, s.extraSum)}.\n- Ненужные: ${markBlock(s.unnecessaryCount, s.unnecessarySum)} (${percent(unnecessaryShare)}).`,
    `Концентрация топ-2: ${s.top2Concentration != null ? top2 : '—'}. \n\n Дней с расходами: ${
      s.activeDays != null ? s.activeDays : '—'
    } из ${s.frame.elapsedDays != null ? s.frame.elapsedDays : '—'}${
      activeDaysPct != null ? ' (' + percent(activeDaysPct) + ')' : ''
    }.`,
    `Категориальная широта: всего активных категорий ${s.categories.length}.`,
    'Вывод: ' +
      (unnecessaryShare > cfg.monthUnnecessaryHighPct
        ? 'Ненужные траты высокие — потенциал для экономии.'
        : s.top2Concentration &&
            s.top2Concentration > cfg.topConcentrationHighPct
          ? 'Концентрация высока — diversify.'
          : 'Профиль устойчивый; наблюдайте за ненужными тратами.'),
  ];
}

// Helpers (duplicated lightweight to avoid leaking service internals)
function money(v: number): string {
  return (
    new Intl.NumberFormat('ru-RU', {
      minimumFractionDigits: v % 1 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(Math.round(v * 100) / 100) + ' €'
  );
}
function percent(p: number): string {
  return `${(p || 0).toFixed(p >= 10 ? 0 : 1)}%`;
}
function plural(count: number): string {
  return count % 10 === 1 && count % 100 !== 11
    ? ''
    : count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 10 || count % 100 >= 20)
      ? 'а'
      : 'ов';
}
function pctShare(part: number, whole: number): number {
  return whole ? (part / whole) * 100 : 0;
}
function deltaPercent(current: number, prev: number): number {
  if (!prev) return 100;
  return ((current - prev) / prev) * 100;
}
function markBlock(count: number, sum: number): string {
  return count ? `${money(sum)} (${count})` : 'нет';
}
function weekUnnecessaryLabel(pct: number, cfg: PeriodNarrativeConfig): string {
  if (pct > cfg.unnecessaryHighPct) return 'повышенная нагрузка';
  if (pct > cfg.unnecessaryWarnPct) return 'стоит контролировать';
  return 'в пределах нормы';
}
