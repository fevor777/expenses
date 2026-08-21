# Categories MCP Implementation Plan

## 1. Goal

Подготовить `mcp-server` к поддержке пользовательских категорий, если в основном приложении категории перестанут быть только статическим справочником и начнут собираться как:

- дефолтные категории из файла;
- пользовательские overrides из Firestore;
- пользовательские custom categories.

Итоговое поведение:

- MCP tools должны работать с тем же итоговым каталогом категорий, что и клиент;
- `list_categories` должен возвращать пользовательский resolved-список;
- `create_expense` и `update_expense` должны принимать пользовательские category ids;
- `includeInBalance` должен определяться по resolved-категории, а не только по статическому дефолту.

## 2. Current State

Сейчас `mcp-server` полностью завязан на статический справочник категорий.

Основные точки:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)
- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)
- [mcp-server/src/domain/output-schemas.ts](../mcp-server/src/domain/output-schemas.ts)
- [mcp-server/src/tools/list-categories.ts](../mcp-server/src/tools/list-categories.ts)

Что именно происходит сейчас:

- категории описаны как `CATEGORY_DEFINITIONS`;
- `CategoryId` вычисляется как union literal type из этого массива;
- входные схемы валидируют category через `z.enum(...)`;
- `list_categories` возвращает только статический список;
- `canonicalizeExpense(...)` и `getDefaultIncludeInBalance(...)` рассчитывают `includeInBalance` по дефолтной статике.

Вывод:

- пока категории в UI статические, MCP консистентен;
- как только в UI появятся пользовательские категории, MCP начнет расходиться с клиентом.

## 3. What Breaks Without MCP Changes

Если сначала внедрить пользовательские категории только в клиенте, а `mcp-server` оставить как есть, появятся такие проблемы:

### 3.1 Custom categories will be rejected

`create_expense` и `update_expense` не примут кастомные `category`, потому что схема ожидает только статические ids.

### 3.2 list_categories becomes outdated

`list_categories` будет отдавать список, который не совпадает с UI:

- не увидит пользовательские custom categories;
- не увидит rename дефолтной категории;
- не увидит скрытые или удаленные дефолтные категории;
- не увидит измененный `includeInBalance`.

### 3.3 includeInBalance defaults become wrong

Если пользователь изменит `includeInBalance` у категории, MCP продолжит использовать старое дефолтное значение.

Это особенно важно для:

- `create_expense`
- `update_expense`
- budget summaries
- calculations, где fallback идет через дефолтное значение категории

### 3.4 Prompting guidance becomes misleading

Любой агент или внешний клиент, который вызывает `list_categories`, будет работать по старому каталогу и давать неверные category ids.

## 4. Recommended Rollout Strategy

### Phase A

Сначала можно внедрить пользовательские категории только в приложении.

Это допустимо, если:

- MCP не является основным способом создания расходов;
- пользовательские категории нужны прежде всего в UI;
- временная неконсистентность между app и MCP приемлема.

### Phase B

После этого отдельно обновить `mcp-server`.

Это предпочтительнее, чем пытаться одновременно менять:

- клиент;
- Firestore data model;
- MCP schemas;
- MCP tools;
- canonicalization rules.

### Practical Recommendation

Для этого проекта я бы считал MCP-изменения **второй фазой**, а не частью первого rollout.

## 5. Target MCP Architecture

В `mcp-server` должен появиться отдельный слой чтения категорий пользователя.

Рекомендуемая схема:

```text
static category file
        +
Firestore user overrides
        ->
resolved categories provider
        ->
MCP tools and validation
```

Ключевая идея:

- статический список остается base defaults;
- Firestore overrides подмешиваются поверх;
- tools и schemas работают уже не с голой статикой, а с resolved view.

## 6. Recommended Data Source In MCP

Если в клиенте категории хранятся по схеме:

- `users/{uid}/category-overrides/{id}`

то в MCP лучше читать их напрямую из Firestore и строить resolved categories на сервере.

Это лучше, чем:

- прокидывать resolved categories из клиента;
- дублировать бизнес-логику на уровне tool inputs;
- хранить вторую серверную копию resolved-списка.

## 7. Proposed Server Components

### 7.1 CategoryOverrideDocument

Добавить серверную модель override-документа.

Например:

```ts
type CategoryOverrideDocument = {
  id: string;
  source: 'default-override' | 'custom';
  baseCategoryId?: string;
  name?: string;
  icon?: string;
  color?: string;
  includeInBalance?: boolean;
  isDeleted?: boolean;
  normalizedName?: string;
  createdAt: number;
  updatedAt: number;
};
```

### 7.2 CategoriesRepository

Новый репозиторий:

- `mcp-server/src/firestore/categories.repository.ts`

Задачи:

- читать все overrides текущего пользователя;
- возвращать документы в нормализованном виде;
- не заниматься merge-логикой.

### 7.3 ResolvedCategoriesService

Новый слой:

- `mcp-server/src/domain/categories.ts`

Задачи:

- взять дефолты из `CATEGORY_DEFINITIONS`;
- применить overrides;
- добавить custom categories;
- исключить скрытые категории;
- находить категорию по id;
- вычислять default `includeInBalance` для resolved category.

## 8. Type System Changes

### 8.1 CategoryId

Сейчас:

```ts
export type CategoryId = (typeof CATEGORY_DEFINITIONS)[number]['id'];
```

Это больше не подойдет, если разрешены custom ids.

Рекомендация:

- перевести `ExpenseDocument.category` на `string`;
- оставить отдельный тип для built-in ids, если он нужен только для статических defaults;
- не использовать literal-union как глобальный тип категории в MCP.

### 8.2 Expense Models

В [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts) нужно ослабить:

- `ExpenseDocument.category`
- `CreateExpenseInput.category`
- `UpdateExpenseInput.category`

С `CategoryId` до `string`.

## 9. Schema Changes

Самая важная точка — [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts).

Сейчас там категория проверяется через `z.enum(staticIds)`.

Для user-defined категорий это не подойдет.

### Option 1. Soft schema + runtime validation

Во входной схеме:

```ts
category: z.string().min(1)
```

А затем в tool handler:

- загрузить resolved categories пользователя;
- проверить, что переданный category id существует;
- если нет, вернуть понятную ошибку.

Плюсы:

- просто внедрить;
- не нужно динамически строить zod enum.

Минусы:

- часть валидации уходит из schema layer в runtime.

### Option 2. Dynamic schema per request

Теоретически можно строить категориальную схему динамически из resolved categories.

Для этого проекта я **не рекомендую** этот путь, потому что:

- он сложнее;
- слабо сочетается с текущим registerTool pattern;
- не дает заметной практической выгоды по сравнению с runtime validation.

### Recommendation

Использовать **soft schema + runtime validation**.

## 10. Tool Changes

### 10.1 list_categories

Файл:

- [mcp-server/src/tools/list-categories.ts](../mcp-server/src/tools/list-categories.ts)

Что менять:

- вместо возврата `CATEGORY_DEFINITIONS` читать resolved categories пользователя;
- вернуть уже merged-список;
- при желании можно отдельно маркировать `source`.

### 10.2 create_expense

Файл:

- [mcp-server/src/tools/create-expense.ts](../mcp-server/src/tools/create-expense.ts)

Что менять:

- валидировать category id через resolved categories;
- если `includeInBalance` не передан явно, брать его из resolved категории;
- если category не найдена, возвращать явную ошибку.

### 10.3 update_expense

Файл:

- [mcp-server/src/tools/update-expense.ts](../mcp-server/src/tools/update-expense.ts)

Что менять:

- при смене category валидировать новый id;
- при смене category без явного `includeInBalance` обновлять fallback по resolved категории;
- сохранить текущую идею, что явный `includeInBalance` имеет приоритет.

### 10.4 Budget And Summary Tools

Большая часть summary tools уже работает по `expense.includeInBalance`, а не по live category lookup.

Это хорошо, потому что:

- исторические расходы не нужно пересчитывать;
- риск регрессии меньше.

Но fallback-логика, если она где-то еще опирается на дефолтную категорию, должна быть проверена и переведена на resolved lookup.

## 11. Output Schema Changes

Нужно проверить и обновить:

- [mcp-server/src/domain/output-schemas.ts](../mcp-server/src/domain/output-schemas.ts)

Особенно:

- category schema для expense output;
- category definition output для `list_categories`.

Если категории больше не ограничены статическим enum, output schema тоже не должна зависеть только от `categoryIdSchema`.

## 12. Repository And Ownership

Сейчас `ExpensesRepository` и другие MCP repositories работают от `ownerUid`.

Это хорошо сочетается с пользовательскими категориями, если MCP по-прежнему single-user scoped.

Тогда `CategoriesRepository` может просто читать:

- `users/{ownerUid}/category-overrides`

То есть multi-tenant логика здесь не усложняется.

## 13. Caching In MCP

Поскольку категории меняются редко, в MCP допустим легкий in-memory cache resolved categories с коротким TTL.

Например:

- кэш на `30-120` секунд;
- ключ — `ownerUid`.

Но это опционально.

Для первой версии можно обойтись и без него, потому что:

- `list_categories` вызывается редко;
- чтение маленькой подколлекции из Firestore дешево;
- лишняя кэш-сложность не обязательна.

Моя рекомендация:

- **v1 без server-side cache**;
- добавить cache только если появится реальная нагрузка.

## 14. Files Expected To Change

### Must change

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)
- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)
- [mcp-server/src/domain/output-schemas.ts](../mcp-server/src/domain/output-schemas.ts)
- [mcp-server/src/tools/list-categories.ts](../mcp-server/src/tools/list-categories.ts)
- [mcp-server/src/tools/create-expense.ts](../mcp-server/src/tools/create-expense.ts)
- [mcp-server/src/tools/update-expense.ts](../mcp-server/src/tools/update-expense.ts)

### Likely new files

- `mcp-server/src/firestore/categories.repository.ts`
- `mcp-server/src/domain/categories.ts`

### Likely review points

- [mcp-server/src/server.ts](../mcp-server/src/server.ts)
- [mcp-server/src/firestore/expenses.repository.ts](../mcp-server/src/firestore/expenses.repository.ts)
- остальные tools, которые могут возвращать category ids через output schemas

## 15. Suggested Implementation Order

### Step 1

- вынести resolved-category логику в отдельный domain helper;
- не трогать пока tools.

### Step 2

- ослабить типы категории с `CategoryId` до `string`;
- обновить входные и выходные схемы.

### Step 3

- добавить `CategoriesRepository`;
- подключить resolved lookup к `list_categories`.

### Step 4

- обновить `create_expense` и `update_expense`;
- переключить fallback `includeInBalance` на resolved category.

### Step 5

- проверить summary tools и любые оставшиеся места, где категория трактуется как статический enum.

## 16. Minimal Viable MCP Scope

Если хочется сделать минимальный MCP rollout без полного рефакторинга, то достаточно:

1. заменить schema `category` с enum на string;
2. добавить runtime validation against resolved categories;
3. переписать `list_categories` на resolved lookup;
4. брать default `includeInBalance` из resolved category.

Этого уже хватит, чтобы MCP:

- видел пользовательские категории;
- мог создавать расходы с custom ids;
- не расходился с UI по базовой категории и `includeInBalance`.

## 17. Final Recommendation

Да, при выбранной схеме категорий изменения в MCP нужны.

Но лучше делать их **отдельной второй фазой**:

- сначала внедрить пользовательские категории в приложении;
- затем адаптировать `mcp-server`;
- не пытаться синхронно менять всё сразу.

Для самого MCP лучший путь:

- оставить статический список как base defaults;
- добавить Firestore repository для overrides;
- строить resolved categories на сервере;
- перейти со статического enum на `string + runtime validation`.
