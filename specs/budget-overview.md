# Budget Overview

Этот файл собирает в одном месте всё, что относится к бюджету в проекте `expenses`.
Ниже описано текущее поведение по коду, а не только по старым спецификациям.

## 1. Что здесь считается бюджетом

В проекте бюджет это не просто одно число на месяц, а набор настроек и производных расчётов:

- `value` — сумма бюджета.
- `period` — длина бюджетного периода в днях.
- `periodStartTs` — точка старта периода в `ms since epoch`.
- `timezone` — IANA timezone для отображения периода.
- `minDayLimit` — вспомогательное значение для прогноза даты исчерпания бюджета.

Главная семантика:

- бюджетная аналитика считает только те расходы, у которых `includeInBalance = true`;
- поэтому budget period и calendar month это разные вещи;
- fixed / regular категории могут существовать в общих расходах, но не влиять на остаток бюджета.

## 2. Где бюджет хранится

### Frontend

Бюджетная сущность описана в `src/app/common/model/budget.model.ts`:

```ts
export class Budget {
  uid?: string;
  value: number;
  period: number;
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
}
```

Основное хранилище:

- Firestore collection: `irregularBudget`
- document key: `uid`

Фронтенд-сервис: `src/app/common/service/irregular-budget.service.ts`

- при наличии авторизованного пользователя бюджет читается и пишется в Firestore;
- без авторизации используется локальный store (`IrregularBudgetStoreService`);
- если `timezone` отсутствует, сервис автоматически подставляет браузерную timezone и пытается домигрировать запись.

### MCP server

На стороне MCP бюджет живёт в settings repository и отдаётся как отдельный ресурс через tools:

- `get_budget`
- `update_budget`

## 3. Значения по умолчанию

В MCP domain-модели дефолтный бюджет:

```ts
export const DEFAULT_BUDGET = {
  value: 600,
  period: 30,
};
```

Во frontend fallback тоже по сути такой же:

- `value = 600`
- `period = 30`
- `timezone = browser timezone`

Это значит:

- если пользователь не настроил бюджет, приложение всё равно может строить часть аналитики;
- но `BudgetSummaryService` отдельно умеет возвращать ошибку `Бюджет не установлен`, если для конкретного сценария бюджет обязателен.

## 4. Как задаётся бюджет в UI

Настройка бюджета находится в `ExportComponent`:

- файл логики: `src/app/export/export.component.ts`
- шаблон: `src/app/export/export.component.html`

Во вкладке `Budget` есть поля:

- `Budget`
- `Start Budget Period`
- `Budget Period Duration`
- `Min Day Limit (exhaust)`

При сохранении вызывается `IrregularBudgetService.addValue(...)`.

Что реально сохраняется:

- `value`
- `period`
- `periodStartTs`
- `timezone`
- `minDayLimit`

### Нюанс

В шаблоне у `Budget Period Duration` стоит `max="60"`, а в TS-проверке разрешено значение до `120`.
То есть сейчас в интерфейсе и в логике есть небольшое расхождение.

## 5. Как строится бюджетный период

Ключевой frontend-сервис: `src/app/common/service/budget-data.service.ts`

Логика такая:

1. Берётся текущий budget.
2. Из него строится rolling frame.
3. В этот frame подгружаются расходы.
4. Дальше поверх этого считается budget summary.

### Если `periodStartTs` задан

Период строится жёстко от этой даты:

- `start = periodStartTs` на начало дня;
- `finish = start + period - 1 день`, до `23:59:59.999`.

Важный момент: текущая дата не используется для “сдвига” окна.  
То есть это anchored period, а не “последние N дней”.

### Если `periodStartTs` не задан

Фронтенд делает fallback на окно длиной `period`, заканчивающееся сегодня:

- `start = now - (period - 1) days`
- `finish = end of today`

MCP использует очень похожую семантику в `buildRollingBudgetFrame(...)`.

## 6. Что именно попадает в budget calculations

Бюджет опирается на `includeInBalance`.

Это поле есть:

- у категории как дефолтное поведение;
- у самого expense как фактический флаг, который участвует в расчётах.

Список встроенных категорий и их дефолтных флагов лежит в:

- `mcp-server/src/domain/models.ts`

Примеры категорий, которые по умолчанию **не** идут в budget/balance:

- `subscriptions`
- `utility-bills`
- `sport`
- `rental-payment`

Примеры категорий, которые по умолчанию идут в budget/balance:

- `meal`
- `travel`
- `alcohol`
- `pharmacy`
- `clothes`
- `another`

Итог:

- `totalSpend` может включать все расходы;
- `irregularSpend` / `budgetedSpend` включает только `includeInBalance = true`.

## 7. Какие budget-метрики считаются

Основная фабрика:

- `src/app/common/model/budget-summary/budget-summary.factory.ts`

Wrapper-класс:

- `src/app/common/model/budget-summary/budget-summary.model.ts`

Pace-логика:

- `src/app/common/model/budget-summary/budget-summary.pace.ts`

Ключевые поля summary:

- `budget`
- `remaining`
- `percentUsed`
- `percentLeft`
- `frameTotal`
- `periodIrregular`
- `todaysTotal`
- `todaysIrregular`
- `dailyAverage`
- `budgetPerDay`
- `needPerDay`
- `todaysNeedRatio`
- `daysLeft`
- `velocityRatio`
- `velocityProjectedTotal`
- `velocityOverrun`
- `energyScore`
- `budgetExhaustion`

### Как считаются основные показатели

- `remaining = max(budget - spentIrregular, 0)`
- `percentUsed = min(spentIrregular / budget * 100, 100)`
- `dailyBudget = budget / daysInFrame`
- `currentVelocity = spentIrregular / daysPassed`
- `projectedTotal = currentVelocity * daysInFrame`
- `overrun = projectedTotal - budget`

### `minDayLimit` на самом деле

Название читается как “минимальный дневной лимит”, но в текущем коде это значение используется как baseline velocity для прогноза даты исчерпания:

- если `minDayLimit <= 0`, дата исчерпания не считается;
- если `minDayLimit > 0`, прогноз строится как `remaining / minDayLimit`.

То есть это не жёсткий лимит на ввод расходов, а параметр прогноза.

## 8. Уведомления и budget summary во frontend

Сервис:

- `src/app/common/service/budget-summary.service.ts`

Он умеет:

- собрать текущую budget summary;
- показать browser notification;
- показать in-app notification;
- вернуть ошибки вроде:
  - `Бюджет не установлен`
  - `Обновите дату начала бюджета.`

Browser notification использует:

- текстовый summary;
- SVG иконку с прогрессом бюджета;
- цветовую индикацию:
  - зелёный до 60%
  - оранжевый после 60%
  - красный после 80%

## 9. Budget в MCP server

Основные budget-related tools:

- `get_budget`
- `update_budget`
- `budget_summary`
- `budget_period_summary`
- `budget_summary_with_expenses_for_period`

Соседние, но не budget-based tools:

- `monthly_summary`
- `month_period_summary`

### Разница budget vs monthly

`budget_summary`:

- использует active budget period;
- считает remaining budget только по `includeInBalance = true`.

`monthly_summary`:

- работает по calendar month;
- не равен budget period, если бюджет начинается не с 1 числа или длится не 30/31 день.

### `get_budget`

Возвращает:

- текущие budget settings;
- `usesDefaultBudget`, если пользовательский budget не сохранён и был подставлен default.

### `update_budget`

Разрешает частично обновлять поля:

- `value`
- `period`
- `periodStartTs`
- `timezone`
- `minDayLimit`

Если не передано ни одного поля, tool падает с ошибкой:

- `At least one budget field must be provided`

## 10. Структура summary в MCP

Функции:

- `mcp-server/src/domain/summaries.ts`
- `mcp-server/src/domain/budget-period.ts`

MCP summary возвращает, среди прочего:

- `frameStart`
- `frameFinish`
- `frameDisplay`
- `budgetValue`
- `budgetPeriodDays`
- `budgetConfiguredPeriodDays`
- `budgetConfiguredStartTs`
- `daysPassed`
- `daysLeft`
- `daysLeftIncludingToday`
- `totalSpend`
- `irregularSpend`
- `budgetedSpend`
- `remainingBudget`
- `recommendedDailyLimit`
- `savings`
- `expenseCount`
- `irregularExpenseCount`
- `categoryBreakdown`

`recommendedDailyLimit` считается как:

- `max(remainingBudget, 0) / daysLeftIncludingToday`

## 11. Связь бюджета с другими сущностями

### Balance

Budget и Balance связаны, но это не одно и то же.

- `balance` отражает остаток discretionary денег;
- `budget` задаёт рамку аналитики и предупреждений;
- обе логики завязаны на `includeInBalance`.

### Savings

Savings не уменьшают budget напрямую, но участвуют в summary на стороне MCP:

- budget summary может вернуть `savings`;
- это скорее сопутствующий финансовый контекст, а не часть формулы `remainingBudget`.

### Categories

Категории влияют на budget через свойство `includeInBalance`.
Это один из самых важных architectural points во всём репозитории.

## 12. Что важно помнить при доработках

1. Budget period уже не “месяц по календарю”, а произвольный anchored period.
2. Любые новые summary/analytics нужно явно определять:
   - они calendar-based;
   - или budget-based.
3. `includeInBalance` важнее названия категории.
4. `minDayLimit` сейчас работает как параметр прогноза, а не как ограничитель.
5. Во frontend и MCP есть схожая, но не полностью идентичная бюджетная логика, поэтому изменения лучше сверять в обеих частях.

## 13. Ключевые файлы

Frontend:

- `src/app/common/model/budget.model.ts`
- `src/app/common/service/irregular-budget.service.ts`
- `src/app/common/service/budget-data.service.ts`
- `src/app/common/service/budget-summary.service.ts`
- `src/app/common/model/budget-summary/budget-summary.factory.ts`
- `src/app/common/model/budget-summary/budget-summary.pace.ts`
- `src/app/export/export.component.ts`
- `src/app/export/export.component.html`

MCP:

- `mcp-server/src/domain/models.ts`
- `mcp-server/src/domain/summaries.ts`
- `mcp-server/src/domain/budget-period.ts`
- `mcp-server/src/tools/get-budget.ts`
- `mcp-server/src/tools/update-budget.ts`
- `mcp-server/src/tools/budget-summary.ts`
- `mcp-server/src/tools/budget-period-summary.ts`
- `mcp-server/src/tools/budget-summary-with-expenses-for-period.ts`
- `mcp-server/README.md`

Спецификации и контекст:

- `specs/APP_SPEC.md`
- `specs/options-for-br-notif.md`
- `specs/categories-overview.md`

## 14. Короткий вывод

В текущем проекте budget — это отдельная подсистема:

- с собственным storage;
- с отдельным rolling period;
- с аналитикой по `includeInBalance`;
- с UI-настройкой;
- с browser/in-app notifications;
- и с параллельным доступом через MCP tools.

Если нужна следующая итерация, логично делать либо:

- отдельный `budget-architecture.md` с диаграммами;
- либо `budget-api.md` только по MCP/DTO/schema;
- либо `budget-logic-audit.md` со списком расхождений и потенциальных багов.
