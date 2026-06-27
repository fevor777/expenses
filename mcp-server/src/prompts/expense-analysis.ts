import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

type PeriodKey = 'today' | 'yesterday' | 'week' | 'month';

type PeriodFrame = {
  label: string;
  startDate: number;
  endDate: number;
  displayDate: string;
};

type AnalysisFrames = {
  current: PeriodFrame;
  previous: PeriodFrame;
};

export function registerExpenseAnalysisPrompts(server: McpServer): void {
  registerExpenseAnalysisPrompt(
    server,
    'analyze_expenses_today',
    'Анализ расходов за сегодня со сравнением со вчера.',
    'today'
  );
  registerExpenseAnalysisPrompt(
    server,
    'analyze_expenses_yesterday',
    'Анализ расходов за вчера со сравнением с позавчера.',
    'yesterday'
  );
  registerExpenseAnalysisPrompt(
    server,
    'analyze_expenses_week',
    'Анализ расходов за текущую неделю со сравнением с прошлой неделей за тот же прогресс.',
    'week'
  );
  registerExpenseAnalysisPrompt(
    server,
    'analyze_expenses_month',
    'Анализ расходов за текущий месяц со сравнением с прошлым месяцем за тот же прогресс.',
    'month'
  );
}

function registerExpenseAnalysisPrompt(
  server: McpServer,
  name: string,
  description: string,
  period: PeriodKey
): void {
  server.registerPrompt(name, { description }, async () => {
    const frames = buildAnalysisFrames(period);

    return {
      description,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: buildAnalysisPrompt(frames),
          },
        },
      ],
    };
  });
}

function buildAnalysisPrompt(frames: AnalysisFrames): string {
  const currentArgumentsJson = JSON.stringify(
    {
      startDate: frames.current.startDate,
      endDate: frames.current.endDate,
      sort: 'desc',
      limit: 500,
    },
    null,
    2
  );

  const previousArgumentsJson = JSON.stringify(
    {
      startDate: frames.previous.startDate,
      endDate: frames.previous.endDate,
      sort: 'desc',
      limit: 500,
    },
    null,
    2
  );

  return [
    `Проанализируй расходы пользователя за период «${frames.current.label}» (${frames.current.displayDate}) и сравни их с периодом «${frames.previous.label}» (${frames.previous.displayDate}).`,
    'Ответ дай на русском языке.',
    'Сначала вызови list_expenses ровно с этими аргументами для текущего периода:',
    currentArgumentsJson,
    'Затем вызови list_expenses ровно с этими аргументами для предыдущего сопоставимого периода:',
    previousArgumentsJson,
    'Если нужны человекочитаемые названия категорий, вызови list_categories.',
    'Если для вывода полезен бюджетный контекст, дополнительно можешь вызвать get_budget и get_savings.',
    'После этого дай краткий, но содержательный разбор. Не начинай сразу со сравнения.',
    'В начале обязательно дай описание текущего периода: общая картина, уровень трат, количество записей и первое впечатление в 2-4 предложениях.',
    'Затем продолжи разбор по пунктам:',
    '1. сумма расходов и количество записей за текущий период',
    '2. сравнение с предыдущим периодом по сумме и количеству',
    '3. топ категорий по расходам и их изменение относительно предыдущего периода',
    '4. крупнейшие отдельные траты',
    '5. необычные, разовые или чрезмерно концентрированные траты',
    '6. один короткий практический вывод или рекомендация',
    'Если в текущем периоде нет расходов, скажи это явно. Если в предыдущем периоде расходов нет, отдельно отметь, что сравнение ограничено.',
  ].join('\n\n');
}

function buildAnalysisFrames(period: PeriodKey, now = new Date()): AnalysisFrames {
  switch (period) {
    case 'today': {
      const todayStart = startOfDay(now);
      const todayEnd = endOfDay(now);
      const yesterday = addDays(now, -1);
      return {
        current: {
          label: 'сегодня',
          startDate: todayStart.getTime(),
          endDate: todayEnd.getTime(),
          displayDate: formatRange(todayStart, todayEnd),
        },
        previous: {
          label: 'вчера',
          startDate: startOfDay(yesterday).getTime(),
          endDate: endOfDay(yesterday).getTime(),
          displayDate: formatRange(startOfDay(yesterday), endOfDay(yesterday)),
        },
      };
    }
    case 'yesterday': {
      const yesterday = addDays(now, -1);
      const dayBeforeYesterday = addDays(now, -2);
      return {
        current: {
          label: 'вчера',
          startDate: startOfDay(yesterday).getTime(),
          endDate: endOfDay(yesterday).getTime(),
          displayDate: formatRange(startOfDay(yesterday), endOfDay(yesterday)),
        },
        previous: {
          label: 'позавчера',
          startDate: startOfDay(dayBeforeYesterday).getTime(),
          endDate: endOfDay(dayBeforeYesterday).getTime(),
          displayDate: formatRange(
            startOfDay(dayBeforeYesterday),
            endOfDay(dayBeforeYesterday)
          ),
        },
      };
    }
    case 'week': {
      const start = startOfWeek(now);
      const finish = endOfDay(now);
      const elapsedDays = differenceInCalendarDays(finish, start) + 1;
      const previousStart = addDays(start, -7);
      const previousFinish = endOfDay(addDays(previousStart, elapsedDays - 1));
      return {
        current: {
          label: 'текущая неделя',
          startDate: start.getTime(),
          endDate: finish.getTime(),
          displayDate: formatRange(start, finish),
        },
        previous: {
          label: 'предыдущая неделя за тот же прогресс',
          startDate: previousStart.getTime(),
          endDate: previousFinish.getTime(),
          displayDate: formatRange(previousStart, previousFinish),
        },
      };
    }
    case 'month': {
      const start = startOfMonth(now);
      const finish = endOfDay(now);
      const elapsedDays = differenceInCalendarDays(finish, start) + 1;
      const previousMonthRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousStart = startOfMonth(previousMonthRef);
      const previousMonthEnd = endOfMonth(previousMonthRef);
      const previousFinishCandidate = endOfDay(addDays(previousStart, elapsedDays - 1));
      const previousFinish =
        previousFinishCandidate.getTime() > previousMonthEnd.getTime()
          ? previousMonthEnd
          : previousFinishCandidate;
      return {
        current: {
          label: 'текущий месяц',
          startDate: start.getTime(),
          endDate: finish.getTime(),
          displayDate: formatRange(start, finish),
        },
        previous: {
          label: 'предыдущий месяц за тот же прогресс',
          startDate: previousStart.getTime(),
          endDate: previousFinish.getTime(),
          displayDate: formatRange(previousStart, previousFinish),
        },
      };
    }
  }
}

function differenceInCalendarDays(left: Date, right: Date): number {
  const leftDay = startOfDay(left).getTime();
  const rightDay = startOfDay(right).getTime();
  return Math.round((leftDay - rightDay) / (24 * 60 * 60 * 1000));
}

function addDays(value: Date, days: number): Date {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate() + days,
    value.getHours(),
    value.getMinutes(),
    value.getSeconds(),
    value.getMilliseconds()
  );
}

function startOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
}

function endOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate(), 23, 59, 59, 999);
}

function startOfWeek(value: Date): Date {
  const date = startOfDay(value);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  return addDays(date, diffToMonday);
}

function startOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth() + 1, 0, 23, 59, 59, 999);
}

function formatRange(start: Date, finish: Date): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const startText = formatter.format(start);
  const finishText = formatter.format(finish);
  return startText === finishText ? startText : `${startText} - ${finishText}`;
}