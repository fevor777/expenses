# Expense Tags Implementation Plan

## 1. Goal

Добавить теги для `Expense` так, чтобы они:

- работали одинаково в online и offline режимах;
- поддерживались во всех основных потоках приложения: создание, редактирование, history, statistics, export;
- не ломали текущую схему hash routing, localStorage fallback и Firestore-синхронизацию;
- были доступны и в `mcp-server`, потому что там есть отдельная модель расходов и отдельные инструменты чтения/записи.

Итоговое поведение v1:

- у каждого `Expense` можно хранить `0..N` тегов;
- теги можно задавать при создании расхода и редактировать позже;
- history/statistics могут фильтровать по тегам;
- экспорт включает теги;
- MCP tools умеют создавать, обновлять, искать и экспортировать расходы с тегами.

## 2. Current State

Сейчас `Expense` плоский и не содержит тегов.

Основные точки, где это видно:

- [src/app/common/model/expense.model.ts](../src/app/common/model/expense.model.ts)
- [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts)
- [src/app/common/service/expense-store.service.ts](../src/app/common/service/expense-store.service.ts)
- [src/app/common/component/filter/multi/multi-filter.component.ts](../src/app/common/component/filter/multi/multi-filter.component.ts)
- [src/app/common/component/filter/date/date-filter.service.ts](../src/app/common/component/filter/date/date-filter.service.ts)
- [src/app/history/history.component.ts](../src/app/history/history.component.ts)
- [src/app/statistics/statistics.component.ts](../src/app/statistics/statistics.component.ts)
- [src/app/export/export.component.ts](../src/app/export/export.component.ts)
- [src/app/expense/expense.component.ts](../src/app/expense/expense.component.ts)
- [src/app/history/edit/expense-edit-modal.component.ts](../src/app/history/edit/expense-edit-modal.component.ts)

Отдельно есть второй контракт расходов в MCP server:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)
- [mcp-server/src/domain/filters.ts](../mcp-server/src/domain/filters.ts)
- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)
- [mcp-server/src/firestore/expenses.repository.ts](../mcp-server/src/firestore/expenses.repository.ts)

Существующая фильтрация уже держит важный архитектурный инвариант:

- локальный store и remote Firestore путь должны давать одинаковый результат;
- межстраничное состояние фильтров переносится через `DateFilterService`;
- `MultiFilter` сейчас содержит только `date`, `categories`, `description`;
- export читает тот же `Expense`, но сериализует поля вручную.

## 3. Recommended Product Scope For v1

Чтобы внедрение осталось компактным и совместимым с текущей архитектурой, рекомендую такой scope для первой версии:

- свободные пользовательские теги как массив строк `string[]` внутри `Expense`;
- без отдельной коллекции `tags` в Firestore;
- без иерархии, цветов, групп и алиасов тегов;
- без отдельного экрана управления тегами;
- фильтрация по тегам в режиме `OR`: если выбрано несколько тегов, расход попадает в выборку, если содержит хотя бы один из них;
- limit на количество тегов на расход и на длину каждого тега.

Почему именно так:

- это минимально меняет текущую data model;
- хорошо укладывается в offline pattern через localStorage;
- не требует нового справочника или отдельной синхронизации;
- `OR`-семантика проще для UI и ближе к возможностям Firestore-массива.

## 4. Recommended Data Model

### 4.1 Angular app model

В [src/app/common/model/expense.model.ts](../src/app/common/model/expense.model.ts) добавить:

```ts
tags?: string[];
```

### 4.2 MCP model

В [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts) добавить `tags?: string[]` в:

- `ExpenseDocument`
- `CreateExpenseInput`
- `UpdateExpenseInput`

### 4.3 Normalization rules

Нужен один канонический helper нормализации тегов, который будет использоваться и в web-app, и в `mcp-server`.

Рекомендованные правила v1:

- trim каждого тега;
- удалить пустые строки;
- привести к lowercase;
- dedupe;
- ограничить, например, до `10` тегов на расход;
- ограничить длину тега, например, до `32` или `40` символов;
- хранить итоговый массив отсортированным для стабильности сравнения и предсказуемого экспорта.

Рекомендуемая форма хранения:

```ts
tags?: string[];
```

Пример:

```ts
['food', 'trip', 'shared']
```

Важно: в v1 лучше хранить уже нормализованные строки, а не пытаться одновременно хранить `rawLabel` и `normalizedLabel`. Это резко уменьшает число edge cases.

## 5. Filtering Semantics

### 5.1 UI filter contract

`MultiFilter` в [src/app/common/component/filter/multi/multi-filter.component.ts](../src/app/common/component/filter/multi/multi-filter.component.ts) стоит расширить до:

```ts
type MultiFilter = {
  categories: string[];
  date: DateFrame;
  description?: string;
  tags?: string[];
};
```

### 5.2 Navigation state

`DateFilterService` в [src/app/common/component/filter/date/date-filter.service.ts](../src/app/common/component/filter/date/date-filter.service.ts) должен уметь временно переносить `tags` между страницами так же, как сейчас переносит `categories` и `description`.

Нужно добавить:

```ts
tags?: string[];
```

### 5.3 Matching behavior

Рекомендую зафиксировать следующую семантику:

- если фильтр тегов пустой, фильтра по тегам нет;
- если выбраны теги `[a, b]`, расход подходит, если содержит `a` или `b`;
- теги сравниваются в normalized lower-case виде;
- `description` и `tags` работают совместно через `AND`:
  расход должен пройти и по description, и по tags, если оба фильтра заданы.

### 5.4 Firestore query risk

На раннем этапе надо отдельно проверить допустимость итоговой комбинации Firestore-условий:

- `uid == userId`
- `date >= start`
- `date <= finish`
- `category in [...]`
- `tags array-contains-any [...]`
- `orderBy('date', 'desc')`

Если точная комбинация не поддерживается Firestore или требует слишком дорогих индексов, безопасный fallback для v1 такой:

- на сервере использовать максимально узкий допустимый запрос;
- остаточную фильтрацию по тегам или категориям делать in-memory;
- локальный `ExpenseStoreService.filterExpenses(...)` держать идентичным по логике.

Это соответствует текущему правилу проекта про parity между Firestore и local fallback.

## 6. UI / UX Plan

## 6.1 Expense creation flow

Основной ввод расхода сейчас начинается из [src/app/expense/expense.component.ts](../src/app/expense/expense.component.ts).

Для v1 рекомендую не усложнять главный экран полноценным сложным редактором тегов сразу. Самый прагматичный вариант:

- добавить компактный input/tag-chip блок рядом с описанием;
- поддержать ввод по `Enter` или разделителю `,`;
- показывать текущие теги как removable chips;
- очищать теги после успешного `addExpense`, так же как сейчас очищается `description`.

Минимальный UI-контракт:

- `currentTags: string[]`
- `tagDraft: string`
- методы `addTagFromDraft`, `removeTag`, `clearTags`

### 6.2 Edit flow

В [src/app/history/edit/expense-edit-modal.component.ts](../src/app/history/edit/expense-edit-modal.component.ts) добавить редактирование тегов в том же формате:

- локальная mutable-копия массива тегов;
- те же правила нормализации при apply;
- отсутствие тегов должно сериализоваться как `undefined` или пустой массив по одному принятому правилу.

Рекомендация: на уровне модели канонизировать `[]` в `undefined`, чтобы не плодить два равнозначных состояния.

### 6.3 History filter UI

`MultiFilterComponent` уже объединяет date/categories/description. Логичное расширение:

- добавить секцию выбора тегов в [src/app/common/component/filter/multi/multi-filter.component.ts](../src/app/common/component/filter/multi/multi-filter.component.ts);
- не смешивать теги с category checkbox-деревом;
- вынести теги в отдельный компонент наподобие `TagFilterComponent`.

Рекомендованный новый компонент:

- [src/app/common/component/filter/tag/tag-filter.component.ts](../src/app/common/component/filter/tag/tag-filter.component.ts) как новый standalone component

Функции компонента:

- показать suggestion list из уже встречавшихся тегов;
- позволить multi-select;
- позволить очистку фильтра;
- эмитить нормализованный `string[]`.

### 6.4 Statistics integration

В [src/app/statistics/statistics.component.ts](../src/app/statistics/statistics.component.ts) нужно провести теги через:

- init из `DateFilterService`;
- вызовы `getExpenses(...)`;
- `navigateToHistory(...)` обратно;
- локальную description-фильтрацию, чтобы не разойтись по семантике с history.

Важно: statistics сейчас много чего пересчитывает на клиенте поверх загруженного списка. Теги должны войти в базовый набор фильтров до расчёта totals, а не постфактум только в отображение.

### 6.5 Optional display surfaces

Для v1 показ тегов в списках не обязателен для запуска фичи, но желателен хотя бы в одном месте:

- либо в history item;
- либо в edit modal;
- либо в карточке latest expense.

Если нужно удержать объём работ, приоритет такой:

1. create/edit support
2. filter support
3. history item tag chips

## 7. Service And Store Changes

## 7.1 ExpenseStoreService

В [src/app/common/service/expense-store.service.ts](../src/app/common/service/expense-store.service.ts):

- расширить сигнатуры `getExpensesObs(...)` и `filterExpenses(...)` новым параметром `tags?: string[]`;
- сохранять `tags` внутри `this.filter`;
- обновить `addExpense`, `updateExpense`, `deleteExpense`, чтобы после локального изменения переиспользовалась новая логика фильтрации;
- фильтрацию по тегам реализовать рядом с category/description, а не отдельным ad hoc кодом в компонентах.

Рекомендуемая логика:

```ts
if (Array.isArray(tags) && tags.length > 0) {
  filteredExpenses = filteredExpenses.filter(expense =>
    (expense.tags || []).some(tag => tags.includes(tag))
  );
}
```

## 7.2 ExpenseService

В [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts):

- расширить `getExpenses(...)` параметром `tags?: string[]`;
- передавать теги в fallback `ExpenseStoreService.getExpensesObs(...)`;
- добавить server-side filtering path для Firestore там, где это допустимо;
- если часть фильтрации остаётся client-side, делать это в одном месте, чтобы не расходиться с store semantics.

Нужно избегать ситуации, где:

- local mode фильтрует по тегам;
- remote mode игнорирует теги;
- statistics/history потом ещё раз по-разному отфильтровывают массив.

## 8. Export Changes

В [src/app/export/export.component.ts](../src/app/export/export.component.ts):

- добавить `tags` в `formatData(...)`;
- определить формат CSV-поля.

Рекомендованный формат CSV v1:

- один столбец `tags`;
- значения внутри столбца склеиваются через `|` или `;`.

Пример:

```csv
tags
food|shared|trip
```

Почему не JSON-массив в CSV:

- сложнее читать вручную;
- хуже сочетается с текущим простым экспортёром.

Дополнительно нужно не забыть про legacy import/export путь через `localStorage` migration в `exportFirebase(...)`: теги должны уходить в Firestore вместе с остальными полями без отдельной обработки.

## 9. MCP Server Changes

## 9.1 Domain model and canonicalization

В [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts):

- добавить helper `normalizeTags(...)`;
- вызвать его внутри `canonicalizeExpense(...)`;
- обновить `mapExpense(...)` path в repository.

Рекомендуемое поведение `normalizeTags(...)`:

- вход `unknown` или `string[]`;
- вернуть `undefined`, если после нормализации тегов нет;
- вернуть deduped/sorted массив, если теги есть.

## 9.2 Schemas

В [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts) добавить `tags` в:

- `createExpenseShape`
- `updateExpenseShape`
- `expenseFilterShape`
- `exportExpensesShape`

Рекомендованная schema-форма:

```ts
tags: z.array(z.string().trim().min(1).max(40)).max(10).optional()
```

## 9.3 Filter normalization

В [mcp-server/src/domain/filters.ts](../mcp-server/src/domain/filters.ts):

- расширить `ExpenseFilterInput`;
- расширить `NormalizedExpenseFilter`;
- нормализовать `tags` точно так же, как `description`;
- добавить helper `applyTagsFilter(...)` рядом с `applyDescriptionFilter(...)`.

## 9.4 Repository query

В [mcp-server/src/firestore/expenses.repository.ts](../mcp-server/src/firestore/expenses.repository.ts):

- добавить попытку server-side tag filter там, где запрос допустим;
- если нужен fallback, сначала получить query result, потом применить `applyTagsFilter(...)` и `slice(0, limit)`.

Нужно удержать тот же принцип, который уже используется для `description`: часть фильтра может быть post-query, но логика должна быть централизованной.

## 9.5 MCP tools impact

Сами tool-файлы, скорее всего, потребуют минимальных изменений, потому что они уже завязаны на schema layer:

- [mcp-server/src/tools/create-expense.ts](../mcp-server/src/tools/create-expense.ts)
- [mcp-server/src/tools/update-expense.ts](../mcp-server/src/tools/update-expense.ts)
- [mcp-server/src/tools/list-expenses.ts](../mcp-server/src/tools/list-expenses.ts)
- [mcp-server/src/tools/search-expenses.ts](../mcp-server/src/tools/search-expenses.ts)
- [mcp-server/src/tools/export-expenses.ts](../mcp-server/src/tools/export-expenses.ts)

Но нужно проверить:

- descriptions tool metadata;
- examples/prompts;
- response serialization, если где-то поля перечислены вручную.

## 10. Firestore Index Plan

Текущие индексы в [firestore.indexes.json](../firestore.indexes.json) покрывают комбинации с `uid`, `date`, `category`, но не `tags`.

После выбора окончательной query shape, вероятно, понадобятся новые composite indexes.

Минимально нужно подготовиться к индексам вида:

- `uid + date + tags`
- возможно `uid + category + date + tags`, если Firestore допускает нужную комбинацию для массива

Здесь нельзя гадать на позднем этапе. Это надо проверить отдельным spike сразу после внесения query changes.

## 11. Suggested Implementation Phases

## Phase 1. Finalize contract

Сделать и согласовать одно короткое решение по API:

- `tags?: string[]`
- lower-case normalized storage
- `OR` semantics for multi-tag filtering
- max tag count / max tag length
- `[] => undefined`

Результат фазы:

- зафиксированная модель
- отсутствие дальнейших спорных решений по semantics

## Phase 2. Core model + normalization

Изменить:

- [src/app/common/model/expense.model.ts](../src/app/common/model/expense.model.ts)
- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)

Добавить общий helper нормализации на web-side и MCP-side.

Результат фазы:

- `Expense` и `ExpenseDocument` уже принимают теги
- create/update paths умеют хранить теги корректно

## Phase 3. Offline/remote filtering parity

Изменить:

- [src/app/common/service/expense-store.service.ts](../src/app/common/service/expense-store.service.ts)
- [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts)
- [src/app/common/component/filter/date/date-filter.service.ts](../src/app/common/component/filter/date/date-filter.service.ts)
- [src/app/common/component/filter/multi/multi-filter.component.ts](../src/app/common/component/filter/multi/multi-filter.component.ts)

Результат фазы:

- теги проходят через local fallback
- теги участвуют в remote queries или post-query filtering
- межстраничный перенос фильтров сохранён

## Phase 4. Create/edit UI

Изменить:

- [src/app/expense/expense.component.ts](../src/app/expense/expense.component.ts)
- [src/app/expense/expense.component.html](../src/app/expense/expense.component.html)
- [src/app/history/edit/expense-edit-modal.component.ts](../src/app/history/edit/expense-edit-modal.component.ts)
- [src/app/history/edit/expense-edit-modal.component.html](../src/app/history/edit/expense-edit-modal.component.html)

Опционально добавить переиспользуемый standalone component, если не хочется дублировать tag-chip UI.

Результат фазы:

- пользователь может создавать и редактировать теги

## Phase 5. Filter UI on history/statistics

Изменить:

- [src/app/history/history.component.ts](../src/app/history/history.component.ts)
- [src/app/statistics/statistics.component.ts](../src/app/statistics/statistics.component.ts)
- новый `TagFilterComponent`

Результат фазы:

- фильтр тегов доступен на history/statistics
- переходы между страницами сохраняют контекст тегов

## Phase 6. Export + MCP

Изменить:

- [src/app/export/export.component.ts](../src/app/export/export.component.ts)
- [mcp-server/src/domain/filters.ts](../mcp-server/src/domain/filters.ts)
- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)
- [mcp-server/src/firestore/expenses.repository.ts](../mcp-server/src/firestore/expenses.repository.ts)
- при необходимости tool descriptions и README

Результат фазы:

- теги присутствуют в экспорте
- MCP APIs понимают теги end-to-end

## Phase 7. Indexes and verification

Изменить:

- [firestore.indexes.json](../firestore.indexes.json)

Проверить поведение:

- online with authenticated Firestore
- offline/localStorage fallback
- export CSV
- MCP create/list/search/update/export

## 12. Testing Plan

В проекте мало существующих unit tests, поэтому стоит добавить точечные проверки именно вокруг новой логики.

### 12.1 Angular tests

Приоритетные unit tests:

- `normalizeTags(...)` helper
- `ExpenseStoreService.filterExpenses(...)`:
  - пустой filter
  - один тег
  - несколько тегов с `OR`
  - совместная фильтрация `date + category + description + tags`
- `MultiFilterComponent` emit payload включает `tags`

### 12.2 MCP tests

Если в `mcp-server` пока нет тестового каркаса, имеет смысл хотя бы добавить небольшие pure-function tests для:

- `normalizeTags(...)`
- `normalizeExpenseFilter(...)`
- `applyTagsFilter(...)`
- `canonicalizeExpense(...)`

### 12.3 Manual verification checklist

Обязательные сценарии:

1. Создать expense с несколькими тегами и убедиться, что он сохраняется.
2. Перезагрузить приложение и проверить, что localStorage path не теряет теги.
3. Отредактировать expense и удалить один тег.
4. Отфильтровать history по одному тегу.
5. Отфильтровать history по двум тегам и подтвердить `OR`-семантику.
6. Перейти history -> statistics -> history и убедиться, что tag filter переносится.
7. Экспортировать CSV и проверить колонку `tags`.
8. Через MCP создать расход с тегами и получить его обратно через list/search.

## 13. Risks And Edge Cases

### 13.1 Firestore query constraints

Главный технический риск: итоговая комбинация filters + sorting + tags-массив может потребовать другой query shape или client-side post-filtering.

### 13.2 Data drift between old and new records

Старые расходы будут без `tags`. Вся логика должна считать это нормальным состоянием.

### 13.3 Empty-array semantics

Нужно заранее решить и везде соблюдать одно правило:

- либо хранить `tags: []`
- либо удалять поле, если тегов нет

Рекомендация: удалять поле, если тегов нет.

### 13.4 Duplicate tag logic in multiple components

Если tag parsing сначала реализовать отдельно в `expense.component` и `expense-edit-modal`, быстро появится расхождение. Лучше вынести helper или переиспользуемый standalone tag-input component.

### 13.5 CSV escaping

Если теги будут содержать запятые или разделитель экспорта, надо либо:

- запрещать такие символы в нормализации;
- либо надёжно экранировать значение.

Для v1 проще запретить `,` и `|` внутри тега либо заменить их на пробел на этапе нормализации.

## 14. Recommended Final Shape

Если нужен самый прагматичный путь без лишней архитектуры, я бы реализовывал именно так:

- `Expense.tags?: string[]`
- теги как freeform normalized lowercase labels
- `OR` filtering
- отдельный reusable tag input/filter component
- общая helper-функция нормализации на web-side и на MCP-side
- Firestore query использовать настолько узкую, насколько позволяет движок, остаток добивать in-memory с обязательной parity с local store

Это наименьший по риску способ добавить теги в текущую архитектуру без отдельного справочника, без миграции данных и без ломки offline модели.