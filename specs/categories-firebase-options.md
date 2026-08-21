# Categories In Firebase Options

## 1. Goal

Добавить пользовательские категории в Firebase/Firestore так, чтобы:

- дефолтные категории продолжали храниться в файле, как сейчас;
- пользователь мог добавлять, редактировать и удалять свои категории;
- пользователь видел только свои категории;
- загрузка категорий не ломала UX, а редкие изменения хорошо кэшировались;
- текущая логика расходов, где в `Expense` хранится `category` id и снимок `includeInBalance`, продолжала работать предсказуемо.

## 2. Current State

Сейчас категории:

- описаны статически в [src/app/common/model/categories.ts](../src/app/common/model/categories.ts);
- синхронно импортируются по всему клиенту;
- в расходах хранятся только как `category: string`;
- при создании расхода значение `includeInBalance` копируется в сам `Expense`;
- не имеют отдельной коллекции в Firestore;
- дублируются в `mcp-server` как отдельный статический справочник.

Похожие пользовательские сущности в проекте уже есть:

- расходы: [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts)
- теги: [src/app/common/service/tag.service.ts](../src/app/common/service/tag.service.ts)

Это важно, потому что у проекта уже есть паттерн:

- Firestore query c `uid`;
- local fallback через `localStorage`;
- `snapshotChanges()` + `metadata.fromCache`;
- optimistic update для редко меняемых справочников.

## 3. Requirements

- Дефолтный каталог категорий остается в файле.
- Пользователь может менять только свою проекцию категорий.
- Пользователь не должен видеть категории других пользователей.
- Категории меняются редко, поэтому нужен дешевый read path и хороший кэш.
- Если категории еще не догрузились, UI должен показывать спиннер или skeleton локально, а не блокировать весь экран.

## 4. Options

### 4.1 Full Copy Per User

Структура:

- `users/{uid}/categories/{categoryId}`

Каждый пользователь получает полную копию дефолтных категорий в Firestore, затем работает уже только с ней.

Плюсы:

- самый простой mental model;
- CRUD естественный;
- security rules простые;
- UI читает один источник правды.

Минусы:

- полное дублирование дефолтного каталога на каждого пользователя;
- тяжело доносить изменения дефолтов из файла до старых пользователей;
- первый рендер сильнее зависит от Firestore;
- нужна инициализация сидов.

### 4.2 File Defaults + Firestore Overrides

Структура:

- дефолты остаются в файле;
- `users/{uid}/category-overrides/{id}`

В Firestore хранятся только:

- пользовательские изменения дефолтной категории;
- пользовательские кастомные категории;
- пометки об удалении дефолтной категории.

Плюсы:

- лучше всего соответствует текущей архитектуре;
- не копирует весь каталог;
- дефолты можно показать сразу;
- обновления дефолтного файла автоматически видны там, где нет override;
- идеально подходит для редко меняемых сущностей.

Минусы:

- merge-логика сложнее;
- нужно аккуратно продумать удаленные категории, на которые уже ссылаются старые расходы;
- MCP тоже придется учить кастомным категориям.

### 4.3 One User Config Document

Структура:

- `users/{uid}/category-config/main`

Внутри одного документа лежат:

- `customCategoriesById`
- `overridesById`
- `deletedDefaultIds`
- `version`

Плюсы:

- один read;
- удобно кэшировать;
- хорошо для редких изменений.

Минусы:

- один документ становится точкой конкуренции;
- сложнее частичные обновления;
- слабее масштабируется на будущее.

### 4.4 Top-Level Collection With uid

Структура:

- `categories/{docId}`
- в каждом документе есть `uid`

Плюсы:

- максимально похоже на текущие `expenses` и `tags`;
- проще внедрить с минимальным рефакторингом data access.

Минусы:

- по смыслу хуже отражает user ownership;
- требует большей дисциплины по `uid`;
- rules и запросы чуть менее надежны, чем у `users/{uid}/...`.

## 5. Recommended Approach

Рекомендую **вариант 4.2: file defaults + Firestore overrides**, при этом хранить данные в подколлекции пользователя:

- `users/{uid}/category-overrides/{id}`

Это лучший компромисс для текущего проекта, потому что:

- дефолтные категории остаются в файле без искусственного дублирования;
- пользователь получает полный CRUD;
- список категорий можно показать сразу, до завершения remote загрузки;
- редкие изменения хорошо сочетаются с Firestore cache и локальным кэшем;
- обновление дефолтного файла не требует массовой миграции пользователей.

## 6. Recommended Data Model

### 6.1 Base Category In File

Файл [src/app/common/model/categories.ts](../src/app/common/model/categories.ts) остается базовым source of truth для встроенных категорий.

Рекомендованная модель:

```ts
type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
};
```

### 6.2 Firestore Override Document

Коллекция:

- `users/{uid}/category-overrides/{id}`

Рекомендуемая форма документа:

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
  createdAt: number;
  updatedAt: number;
  normalizedName?: string;
};
```

Семантика:

- если `source = 'default-override'`, то `id` совпадает с id дефолтной категории;
- если `source = 'custom'`, то это новая пользовательская категория, например `custom_xxx`;
- `isDeleted = true` для дефолтной категории означает “скрыть из выбора”, а не физически забыть историю расходов;
- `normalizedName` нужен для сортировки и возможных проверок уникальности.

### 6.3 Resolved Category In UI

После merge в клиенте UI должен работать уже не с двумя источниками, а с итоговой коллекцией:

```ts
type ResolvedCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  includeInBalance: boolean;
  source: 'default' | 'default-override' | 'custom';
  hidden?: boolean;
};
```

## 7. Merge Rules

`CategoryService` должен собирать итоговый каталог так:

1. взять дефолтные категории из файла;
2. применить `default-override` документы поверх совпадающих `id`;
3. удалить из активного списка дефолтные категории с `isDeleted = true`;
4. добавить `custom` категории;
5. отсортировать итоговый список по `normalizedName` или `name`.

Правила:

- если у дефолтной категории нет override, используется файл как есть;
- если пользователь переименовал категорию, старая история расходов не ломается, потому что расход хранит только id;
- если пользователь изменил `includeInBalance`, это влияет на новые расходы, но не обязано ретроактивно переписывать старые, потому что там уже лежит снимок `expense.includeInBalance`;
- если категория удалена, она исчезает из селекторов, но должна корректно отображаться в старой истории, пока на нее есть ссылки.

## 8. CategoryService

Нужен отдельный `CategoryService`, который заменит прямой импорт `Categories` в UI-потоках.

Рекомендуемый контракт:

```ts
getCategories(useCache?: boolean): Observable<ResolvedCategory[]>;
getCategoryById(id: string): Observable<ResolvedCategory | undefined>;
createCategory(input: CategoryInput): Observable<ResolvedCategory>;
updateCategory(id: string, patch: CategoryPatch): Observable<ResolvedCategory>;
deleteCategory(id: string): Observable<string>;
```

Внутри сервиса:

- база по умолчанию берется из файла;
- поверх подмешиваются Firestore overrides;
- результат держится в памяти через `BehaviorSubject`;
- можно хранить последнюю resolved-копию в `localStorage`, как это уже сделано для тегов.

## 9. Loading And Cache Strategy

### 9.1 Recommended Read Flow

Рекомендованный bootstrap:

1. сразу отдать дефолты из файла;
2. если есть локальный resolved cache, использовать его для ускорения повторного входа;
3. подписаться на Firestore overrides;
4. если пришел cached snapshot, сразу применить его;
5. когда пришел server snapshot, тихо обновить UI.

### 9.2 Firestore Cache

Для web стоит включить persistent offline cache для Firestore.

Практический смысл:

- повторные заходы станут быстрее;
- overrides будут доступны оффлайн;
- `fromCache` уже хорошо ложится на текущий стиль сервиса тегов и расходов.

Это особенно полезно здесь, потому что категории меняются редко.

### 9.3 Spinner Strategy

Показывать spinner или skeleton стоит точечно:

- на селекторе категорий в форме создания расхода;
- в модалке редактирования расхода;
- в category-filter;
- в местах, где отображение зависит от уже смерженного списка.

Не стоит:

- блокировать всю history page;
- блокировать рендер существующих расходов, если не догрузилась только мета-информация категории.

Fallback-поведение:

- если resolved-категория еще не найдена, показывать имя из дефолтного файла;
- если id вообще неизвестен, показывать нейтральный placeholder вроде `Unknown category`.

## 10. Firestore Security Rules

Так как категории строго пользовательские, рекомендуемый путь:

- `users/{uid}/category-overrides/{id}`

Рекомендуемое правило:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/category-overrides/{id} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == uid;
    }
  }
}
```

Это дает:

- пользователь видит только свои категории;
- не нужно хранить `uid` в документе;
- путь сам по себе уже задает tenant boundary.

## 11. Indexes

Для рекомендованной схемы отдельные сложные composite indexes, скорее всего, не понадобятся, если запрос будет простым:

- чтение всей подколлекции пользователя;
- сортировка на клиенте;
- или `orderBy('normalizedName')` без сложных `where`.

Если позже появятся:

- `where('isDeleted', '==', false)`
- `orderBy('normalizedName')`

то может понадобиться дополнительный индекс.

## 12. UI Refactor Scope

Сейчас многие места импортируют `Categories`, `getCategoryById`, `getCategoryNameById` напрямую.

Это значит, что внедрение надо делать поэтапно.

### Phase 1

- ввести `CategoryService`;
- перевести create/edit/category-picker на асинхронный источник;
- сохранить file defaults как fallback.

### Phase 2

- перевести filter-компоненты;
- перевести history item label;
- перевести statistics и calendar, где есть прямой доступ к категориям.

### Phase 3

- адаптировать MCP server под custom/override категории;
- синхронизировать list-categories и canonicalization rules.

## 13. Expense Semantics

Важно сохранить текущее поведение:

- `expense.category` остается строковым id;
- `expense.includeInBalance` продолжает денормализоваться в момент создания/редактирования расхода.

Это снижает риск регрессий:

- старые расходы не обязаны пересчитываться после изменения категории;
- budget/statistics остаются стабильными;
- исторические записи не зависят от того, как именно потом менялась категория пользователя.

## 14. Migration Plan

### Step 1

- добавить `CategoryService` и resolved-модель;
- не трогать пока весь UI, только подготовить инфраструктуру.

### Step 2

- реализовать Firestore override storage;
- добавить local cache и загрузочный state.

### Step 3

- перевести экран выбора категории в создании расхода;
- добавить spinner/skeleton для выбора категории.

### Step 4

- перевести редактирование расхода;
- перевести category filter.

### Step 5

- перевести history/statistics/calendar;
- убрать прямые зависимости от статического `Categories`, где это возможно.

### Step 6

- обновить `mcp-server`, чтобы он понимал пользовательские категории;
- решить, будет ли сервер читать их из Firestore или получать уже resolved-view из клиента.

## 15. Risks And Open Questions

- Нужно определить правило уникальности имен категорий: запрещать дубликаты или нет.
- Нужно определить формат id для `custom` категорий.
- Нужно решить, можно ли пользователю удалять дефолтную категорию, если на нее уже ссылаются существующие расходы.
- Нужно решить, будет ли `includeInBalance` у дефолтной категории редактируемым полем.
- Нужно решить, как именно обновлять MCP-справочник, если пользовательские категории нужны и там.

## 16. Final Recommendation

Для этого проекта рекомендую:

- хранить дефолтные категории в файле, как сейчас;
- хранить пользовательские изменения в `users/{uid}/category-overrides/{id}`;
- ввести `CategoryService`, который строит resolved-каталог из файла и Firestore;
- включить persistent Firestore cache;
- показывать spinner только локально, в местах, где категория реально нужна для взаимодействия.

Это решение лучше всего сочетает:

- низкий риск миграции;
- хороший UX на первом экране;
- строгую изоляцию данных пользователя;
- совместимость с текущей моделью `Expense`.
