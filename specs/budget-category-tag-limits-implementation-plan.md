# Budget Category/Tag Limits Implementation Plan

## 1. Goal

Добавить в проект `expenses` возможность задавать дополнительные бюджетные лимиты:

- на конкретную категорию;
- на конкретный тэг.

В рамках этого документа рассматривается **вариант 1**:

- лимиты не выносятся в отдельную коллекцию;
- лимиты хранятся прямо внутри текущего budget-документа `irregularBudget`;
- расчёты выполняются поверх уже известного budget period и списка расходов за этот период.

Итоговое поведение v1:

- у пользователя остается один основной бюджет на период;
- дополнительно можно завести `0..N` лимитов на категории и тэги;
- каждый лимит показывает:
  - заданную сумму;
  - фактические траты за активный budget period;
  - остаток;
  - процент использования;
  - статус превышения;
- расчёты используют ту же budget-семантику, что и основной бюджет:
  учитываются только расходы с `includeInBalance = true`.

## 2. Why This Variant

Этот вариант выбран как самый быстрый путь к релизу, потому что:

- текущий бюджет уже хранится единым документом в `irregularBudget/{uid}`;
- frontend и MCP уже умеют читать и записывать этот документ;
- budget summary уже строится по активному budget period, а не по отдельным лимитным коллекциям;
- для category/tag limits не нужен отдельный Firestore query planner:
  можно фильтровать расходы in-memory после загрузки периода.

Практический вывод:

- первая версия получается компактной;
- offline-режим и localStorage fallback остаются почти без изменений;
- MCP можно расширить без нового repository слоя для отдельной сущности.

## 3. Current State

Сейчас budget-модель хранит только:

- `value`
- `period`
- `periodStartTs`
- `timezone`
- `minDayLimit`

Основные точки:

- [specs/budget-overview.md](./budget-overview.md)
- [src/app/common/model/budget.model.ts](../src/app/common/model/budget.model.ts)
- [src/app/common/service/irregular-budget.service.ts](../src/app/common/service/irregular-budget.service.ts)
- [src/app/common/service/irregular-budget-store.service.ts](../src/app/common/service/irregular-budget-store.service.ts)
- [src/app/common/service/budget-data.service.ts](../src/app/common/service/budget-data.service.ts)
- [mcp-server/src/firestore/settings.repository.ts](../mcp-server/src/firestore/settings.repository.ts)

Что важно для новой фичи:

- у расходов уже есть `category` и `tagIds`;
- тэги в expense хранятся как `tagIds`, а не как имена;
- категории и тэги уже имеют свои сущности и свои правила нормализации;
- budget calculations и budget summary уже опираются на активный budget period;
- budget semantics уже завязана на `includeInBalance`.

Это означает, что новая фича в первую очередь требует:

- расширить модель `Budget`;
- добавить UI управления лимитами;
- добавить слой расчёта limit summaries;
- расширить MCP `get_budget` / `update_budget` и budget summary outputs.

## 4. Product Scope For v1

Чтобы первая версия осталась управляемой, рекомендую зафиксировать такой scope:

- лимит привязывается либо к одной категории, либо к одному тэгу;
- лимит задается суммой в валюте основного бюджета;
- лимит действует на текущий active budget period;
- лимит считает только расходы `includeInBalance = true`;
- лимит не изменяет основной бюджет и не участвует в его формуле;
- лимит не блокирует ввод расходов и не запрещает операции;
- лимит служит только как аналитика и предупреждение;
- один расход может одновременно попадать:
  - в основной бюджет;
  - в category limit;
  - в tag limit;
  - в несколько tag limits, если у расхода несколько тэгов.

Что сознательно не делаем в v1:

- комбинированные правила вида `category + tag`;
- AND/OR логика по нескольким тэгам;
- групповые лимиты на несколько категорий;
- лимиты по календарному месяцу отдельно от budget period;
- историю лимитов;
- archived / disabled / scheduled rules;
- жёсткую синхронизацию суммы всех подлимитов с основным budget value.

## 5. Core Semantics

### 5.1 Rule Types

Нужны два типа лимитов:

- `category`
- `tag`

### 5.2 Matching

Правила матчинга:

- category limit матчится по `expense.category === targetId`;
- tag limit матчится, если `expense.tagIds` содержит `targetId`;
- в расчёт попадают только расходы текущего активного budget period;
- в расчёт попадают только расходы с `includeInBalance = true`.

### 5.3 Duplicates

Для v1 лучше запретить дубликаты:

- не более одного лимита на один `categoryId`;
- не более одного лимита на один `tagId`.

Это упростит:

- UI;
- валидацию;
- summary;
- MCP update semantics.

### 5.4 Deleted Or Hidden Targets

Нужно заранее определить поведение:

- если категория скрыта, но лимит на неё уже есть, лимит не удаляется автоматически;
- если тэг удалён, лимит не удаляется автоматически;
- такой лимит считается `orphaned`, но продолжает храниться в budget-документе;
- в UI он должен отображаться отдельно и предлагать удалить правило вручную.

Почему так:

- автоматическое удаление опасно;
- пользователь может случайно потерять настройку;
- исторические расходы всё равно могут содержать эти ids.

## 6. Proposed Data Model

### 6.1 Frontend Budget Model

В [src/app/common/model/budget.model.ts](../src/app/common/model/budget.model.ts) расширить модель:

```ts
export type BudgetLimitType = 'category' | 'tag';

export type BudgetLimitRule = {
  id: string;
  type: BudgetLimitType;
  targetId: string;
  value: number;
};

export class Budget {
  uid?: string;
  value: number;
  period: number;
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
  limits?: BudgetLimitRule[];
}
```

### 6.2 Why `id` Is Still Useful

Даже если правило уникально по `(type, targetId)`, поле `id` всё равно полезно:

- удобнее для `trackBy` в Angular;
- удобнее для точечного удаления;
- устойчивее к будущему расширению модели;
- облегчает optimistic UI.

Рекомендуемый формат:

```ts
category:meal
tag:<tagId>
```

Можно хранить и более явный вариант:

```ts
limit_category_meal
limit_tag_abc123
```

Главное:

- формат должен быть детерминированным;
- не нужно использовать случайные UUID для v1.

### 6.3 Normalization Rules

Нужен единый helper нормализации `limits`:

- отбросить элементы без `type`, `targetId` или валидного `value`;
- `type` ограничить `category | tag`;
- `targetId` триммить;
- `value` округлять тем же способом, что и остальные валютные значения;
- лимиты со значением `< 0` отбрасывать или валидировать как ошибку;
- дедуплицировать по `(type, targetId)`;
- сортировать стабильно:
  - сначала `category`;
  - потом `tag`;
  - внутри по `targetId`.

Рекомендация:

- канонизировать пустой список в `undefined`, как уже делается для `tagIds`.

### 6.4 MCP Budget Model

В [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts) добавить те же типы:

```ts
export type BudgetLimitType = 'category' | 'tag';

export type BudgetLimitRule = {
  id: string;
  type: BudgetLimitType;
  targetId: string;
  value: number;
};

export type BudgetDocument = {
  uid?: string;
  value: number;
  period: number;
  periodStartTs?: number;
  timezone?: string;
  minDayLimit?: number;
  limits?: BudgetLimitRule[];
};
```

И обновить `canonicalizeBudget(...)`, чтобы:

- нормализовать `limits`;
- сохранять обратную совместимость со старыми документами без `limits`.

## 7. Suggested Summary Model

Кроме raw rules, нужен derived summary-слой.

### 7.1 Budget Limit Summary Item

```ts
export type BudgetLimitSummary = {
  id: string;
  type: 'category' | 'tag';
  targetId: string;
  targetLabel: string;
  orphaned: boolean;
  budget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  expenseCount: number;
  exceeded: boolean;
};
```

### 7.2 Why Label Must Be Derived

В rule лучше хранить только `targetId`, а `targetLabel` получать во время summary:

- category label резолвится через resolved categories;
- tag label резолвится через tag dictionary;
- это сохраняет связь при rename;
- не нужно дублировать имя в budget-документе.

## 8. Frontend Architecture Plan

### 8.1 Model Layer

Добавить:

- `BudgetLimitType`
- `BudgetLimitRule`
- `normalizeBudgetLimits(...)`
- `canonicalizeBudget(...)` если появится отдельный helper и на frontend

Файлы-кандидаты:

- [src/app/common/model/budget.model.ts](../src/app/common/model/budget.model.ts)
- новый helper рядом с budget model или в отдельном `budget-limits.model.ts`

### 8.2 Store Layer

Обновить localStorage fallback в
[src/app/common/service/irregular-budget-store.service.ts](../src/app/common/service/irregular-budget-store.service.ts):

- читать `limits` из localStorage;
- прогонять их через normalizer;
- писать канонизированную форму обратно;
- не ломать старые записи без `limits`.

### 8.3 Remote Service Layer

Обновить [src/app/common/service/irregular-budget.service.ts](../src/app/common/service/irregular-budget.service.ts):

- `addValue(...)` должен сохранять `limits`;
- `getValue()` должен возвращать канонизированный budget с `limits`, если они есть;
- миграция timezone не должна терять `limits`.

### 8.4 Derived Summary Service

Нужен новый frontend-сервис, например:

- `src/app/common/service/budget-limit-summary.service.ts`

Задачи сервиса:

- получить текущий budget;
- получить активный budget frame;
- получить расходы в этом frame;
- получить resolved categories;
- получить tags;
- построить `BudgetLimitSummary[]`.

Предпочтительный контракт:

```ts
getCurrentLimitSummaries(): Observable<BudgetLimitSummary[]>
```

или:

```ts
getCurrentBudgetWithLimitSummaries(): Observable<{
  budget: Budget;
  dateFrame: DateFrame;
  expenses: Expense[];
  limitSummaries: BudgetLimitSummary[];
}>
```

### 8.5 Computation Strategy

Не нужно делать отдельные Firestore-запросы на каждый лимит.

Правильная стратегия:

1. Один раз получить расходы за активный budget period.
2. Один раз пройти по массиву расходов.
3. Накопить:
   - общий budget summary;
   - category totals map;
   - tag totals map.
4. Поверх budget.limits собрать итоговые summaries.

Это даст:

- предсказуемую производительность;
- одинаковое поведение online/offline;
- отсутствие взрыва числа запросов.

## 9. UI / UX Plan

### 9.1 Settings / Budget Tab

Основная точка управления должна остаться в budget settings:

- [src/app/export/export.component.ts](../src/app/export/export.component.ts)
- [src/app/export/export.component.html](../src/app/export/export.component.html)

Предлагаемый новый блок:

- секция `Budget Limits`
- две подформы:
  - `Add category limit`
  - `Add tag limit`
- список уже добавленных лимитов

Минимальный UI-контракт:

- выбор типа или две отдельные формы;
- category select из active categories;
- tag select из active tags;
- numeric input для суммы;
- кнопка add;
- список rules с delete;
- inline validation для duplicate / invalid value.

### 9.2 Why Not Put Limit Into Category/Tag Settings

Для варианта 1 лучше **не** встраивать лимит в category card или tag card, потому что:

- источник правды всё равно `Budget`;
- у пользователя может быть один экран budget-настроек как центр управления;
- не надо смешивать category/tag CRUD с budget semantics;
- проще сохранить совместимость с MCP `get_budget/update_budget`.

### 9.3 Display In Budget Overview

Нужно показать не только форму редактирования, но и результат.

Рекомендация:

- на budget overview экране добавить список `Category and Tag Limits`;
- для каждого лимита показывать:
  - label;
  - spent / budget;
  - remaining;
  - progress bar;
  - exceeded badge.

### 9.4 Orphaned Rules UX

Для orphaned rules:

- label показывать как:
  - `Unknown category (<id>)`
  - `Deleted tag (<id>)`
- добавлять badge `orphaned`;
- давать только действие `delete`.

### 9.5 Mobile Constraints

На мобильном UI важно:

- не делать широкие таблицы;
- использовать stacked cards;
- число действий на карточке ограничить;
- прогресс и spent/budget выводить в 1-2 строки.

## 10. CRUD Semantics In UI

### 10.1 Add

При добавлении лимита:

- пользователь выбирает category или tag;
- вводит сумму;
- клиент валидирует уникальность `(type, targetId)`;
- формируется детерминированный `id`;
- budget обновляется целиком через существующий save flow.

### 10.2 Edit

Для v1 лучше не делать inline edit отдельного rule.

Рекомендация:

- первая версия поддерживает только:
  - add
  - delete
  - recreate with another value

Почему:

- дешевле в реализации;
- меньше edge cases;
- не нужен дополнительный editing state.

Если edit все же нужен в v1, безопасный вариант:

- редактировать только `value`;
- `type` и `targetId` после создания считать неизменяемыми.

### 10.3 Delete

Удаление rule:

- просто удаляет элемент из `budget.limits`;
- не трогает расходы;
- не трогает категории и тэги.

## 11. Summary Calculation Details

### 11.1 Category Totals

При проходе по расходам:

- если `expense.includeInBalance !== true`, расход пропускается;
- иначе его сумма добавляется в:
  - общий irregular/budgeted spend;
  - categoryTotals[expense.category].

### 11.2 Tag Totals

Для тэгов:

- если `expense.tagIds` отсутствуют, расход не влияет на tag limits;
- если у расхода несколько тэгов, сумма добавляется в каждый `tagId` отдельно.

Это означает, что:

- сумма across all tag limits не обязана сходиться с общим budget spend;
- это нормально и должно быть зафиксировано в продуктовой семантике.

### 11.3 Percent And Remaining

Рекомендуемые формулы:

- `spent = matched irregular spend`
- `remaining = max(limit - spent, 0)`
- `rawRemaining = limit - spent`
- `percentUsed = limit > 0 ? min(spent / limit * 100, 100) : 100`
- `exceeded = spent > limit`

Важно:

- для UI полезно хранить и `rawRemaining`, если нужен отрицательный остаток;
- если такой UX не нужен, можно ограничиться `remaining` и `exceeded`.

### 11.4 Zero Budget Edge Case

Лимит `0` должен быть допустим:

- это осмысленный сценарий “не тратить на это вообще”;
- при наличии совпадающих расходов `exceeded = true`;
- `percentUsed` можно считать `100`, если `spent > 0`, иначе `0`.

## 12. Category And Tag Lookup Strategy

### 12.1 Categories

Для category limits label должен резолвиться через текущий resolved category catalog.

Это важно, потому что:

- категория может быть renamed;
- категория может быть custom;
- категория может быть hidden.

### 12.2 Tags

Для tag limits label должен резолвиться через current tag dictionary:

- `tag.id -> tag.name`

Если тэг не найден:

- summary item помечается как orphaned;
- label строится из id.

## 13. MCP Changes

### 13.1 Models

Обновить в `mcp-server`:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)
- [mcp-server/src/domain/output-schemas.ts](../mcp-server/src/domain/output-schemas.ts)
- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)

Нужно добавить поддержку `limits` в:

- `BudgetDocument`
- `UpdateBudgetInput`
- output schema `get_budget`
- output schema `update_budget`

### 13.2 Input Shape For `update_budget`

Для варианта 1 лучше разрешить обновлять `limits` целиком:

```ts
limits?: Array<{
  id: string;
  type: 'category' | 'tag';
  targetId: string;
  value: number;
}>
```

Это проще, чем добавлять отдельные tools:

- `create_budget_limit`
- `delete_budget_limit`
- `update_budget_limit`

Почему это нормально для v1:

- budget уже обновляется whole-document style;
- лимиты это вложенный массив в этом же документе;
- специальных серверных transactional guarantees пока не требуется.

### 13.3 Settings Repository

В [mcp-server/src/firestore/settings.repository.ts](../mcp-server/src/firestore/settings.repository.ts):

- `getBudget()` должен читать `limits`;
- `updateBudget()` должен сохранять `limits`;
- canonicalization должна происходить до `.set(...)`.

### 13.4 Budget Summary Tool

Текущий `budget_summary` уже считает summary по активному frame.

Рекомендуемое расширение:

- добавить optional поле `limitSummaries` в ответ;
- не менять основной смысл существующих полей;
- limit summaries строить на том же списке расходов, что и основной summary.

Пример shape:

```ts
limitSummaries?: Array<{
  id: string;
  type: 'category' | 'tag';
  targetId: string;
  budget: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  expenseCount: number;
  exceeded: boolean;
}>
```

### 13.5 Label Enrichment In MCP

Для MCP есть два пути:

1. Возвращать только `targetId` и сырые агрегаты.
2. Дополнительно резолвить label.

Для v1 я рекомендую:

- в `get_budget` хранить и возвращать raw rules;
- в `budget_summary` по возможности возвращать и `targetLabel`, и `orphaned`;
- если это замедляет серверный путь, можно оставить label enrichment на клиент.

## 14. Firestore And Rules Impact

Сама коллекция не меняется:

- всё по-прежнему хранится в `irregularBudget/{uid}`.

Это означает:

- существующие Firestore rules для `irregularBudget` остаются совместимыми;
- отдельные новые permissions не нужны;
- миграция проходит мягко.

Что всё же нужно проверить:

- не появятся ли слишком большие budget-документы;
- не потеряются ли новые поля в offline merge / Firestore cache;
- не конфликтует ли whole-document update при параллельном редактировании бюджета на двух клиентах.

## 15. Migration Plan

### 15.1 Existing Users

Старые budget-документы не содержат `limits`.

Желаемое поведение:

- отсутствие `limits` трактуется как “лимитов нет”;
- никаких обязательных one-shot migrations не требуется;
- документ обновится естественно при следующем save.

### 15.2 Local Storage

Для локального `irregularBudget`:

- старые записи без `limits` продолжают читаться;
- новый store silently normalizes их в текущий формат;
- пустые `limits` можно не сохранять вовсе.

### 15.3 Forward Compatibility

Если позже проект перейдет на отдельную коллекцию budget rules, этот вариант все равно оставляет понятный путь миграции:

- читать старое `budget.limits`;
- переносить их в новую коллекцию;
- сохранять обратную совместимость на время rollout.

## 16. Rollout Plan

### Phase 1. Data Model And Storage

- расширить `Budget` model в app и MCP;
- добавить `limits` normalizer;
- обновить local store;
- обновить frontend budget service;
- обновить MCP settings repository;
- обновить MCP schemas.

### Phase 2. Frontend CRUD UI

- добавить управление лимитами в budget settings;
- показать список существующих правил;
- добавить client-side validation;
- сохранить через существующий budget save.

### Phase 3. Derived Summaries

- реализовать frontend summary service;
- показать limit summary cards в budget overview;
- обработать orphaned category/tag ids.

### Phase 4. MCP Summary Support

- расширить `budget_summary`;
- при необходимости расширить `budget_period_summary`;
- добавить output fields для limit summaries.

### Phase 5. Tests And Verification

- unit tests;
- integration tests;
- manual browser checks;
- MCP checks.

## 17. Testing Plan

### 17.1 Unit Tests

#### Budget Model / Normalization

- `limits` отсутствует -> остается `undefined`;
- invalid rule отбрасывается или валидируется как ошибка;
- duplicate `(type, targetId)` дедуплицируется;
- deterministic `id` генерируется стабильно;
- `0` budget value для rule разрешен;
- negative `value` отклоняется;
- sort order нормализуется стабильно.

#### Summary Computation

- category summary считает только matching category;
- tag summary считает по `tagIds`;
- расходы без `includeInBalance` исключаются;
- расходы без `tagIds` не попадают в tag summary;
- multiple tags у одного расхода увеличивают каждый соответствующий tag total;
- `percentUsed`, `remaining`, `exceeded` считаются корректно;
- orphaned rule получает fallback label.

#### Store / Service

- localStorage roundtrip сохраняет `limits`;
- старый budget без `limits` читается без ошибок;
- timezone migration не удаляет `limits`;
- remote value changes синхронизируются в store.

### 17.2 MCP Tests

- `get_budget` возвращает `limits`, если они сохранены;
- `update_budget` принимает `limits`;
- invalid limit type/value отклоняется;
- duplicate rules канонизируются;
- `budget_summary` включает limit summaries;
- расчёт limit summaries совпадает с frontend semantics.

### 17.3 Browser Matrix

- authenticated user может добавить category limit;
- authenticated user может добавить tag limit;
- duplicate rule блокируется;
- delete rule работает;
- orphaned tag rule отображается после удаления тэга;
- hidden category rule отображается корректно;
- mobile layout не ломается;
- offline mode сохраняет и читает `limits`.

## 18. Risks And Tradeoffs

### 18.1 Budget Document Becomes Heavier

Это главный архитектурный минус варианта 1.

Даже если сейчас это приемлемо, `Budget` превращается из простого settings-документа в контейнер для массива правил.

Следствия:

- сложнее поддерживать модель;
- больше риск merge-конфликтов;
- хуже масштабируемость при большом числе лимитов.

### 18.2 Whole-Document Updates

Сейчас budget обновляется как один объект.

Если два клиента редактируют:

- один меняет основной budget value;
- второй меняет limits;

то возможна потеря части изменений без merge semantics.

Для v1 это можно принять, но риск надо осознанно зафиксировать.

### 18.3 Tags Are More Fragile Than Categories

Category id обычно стабильнее.
Tag id зависит от жизненного цикла пользовательского тэга.

Значит:

- orphaned tag rules будут возникать чаще;
- UX для deleted tags обязателен.

### 18.4 Double Counting Across Limits

Если расход имеет несколько тэгов, один и тот же amount попадет в несколько tag limits.

Это может удивлять пользователя, если не объяснить семантику.

Поэтому в UI и документации желательно прямо указать:

- лимиты независимы друг от друга;
- их суммы не обязаны сходиться с общим budget spend.

## 19. Recommendation On Final v1 Shape

Для первой рабочей версии я рекомендую такой минимальный набор:

- хранить `limits?: BudgetLimitRule[]` внутри `Budget`;
- поддержать только `add` и `delete` в UI;
- не делать сложный inline edit;
- считать summaries только по `includeInBalance = true`;
- использовать `targetId`, а не name;
- показывать orphaned rules;
- не запрещать overlaps и double counting между разными rules;
- расширить `budget_summary` limit summaries, но без обязательного глубокого label enrichment в первой итерации.

## 20. Acceptance Criteria

- budget model в app и MCP поддерживает `limits`;
- старые budget-документы читаются без ошибок;
- budget save/load сохраняет `limits` online и offline;
- пользователь может добавить и удалить limit на category;
- пользователь может добавить и удалить limit на tag;
- duplicate limit на тот же `(type, targetId)` не создается;
- budget overview показывает корректные spent/remaining/progress для каждого лимита;
- hidden category и deleted tag не ломают экран;
- MCP `get_budget` и `update_budget` поддерживают `limits`;
- MCP `budget_summary` может вернуть limit summaries с той же семантикой, что и frontend;
- существующий основной budget summary не меняет поведение для пользователей без `limits`.

## 21. Nice-To-Have After v1

- редактирование `value` без удаления и пересоздания rule;
- reorder limits;
- disable/enable limit;
- note / color / emoji для rule;
- фильтр history/statistics “show expenses for this limit”;
- limit notifications при достижении 80% / 100%;
- eventual migration в отдельную коллекцию, если feature станет широкой.
