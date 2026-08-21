# Categories Overview

## 1. Short Summary

В текущем проекте категории - это статический доменный справочник, а не отдельная пользовательская сущность.

- список категорий захардкожен в клиенте;
- в расходе хранится только строковый `category` id;
- при создании расхода в него дополнительно копируется `includeInBalance`;
- отдельной коллекции `categories` в Firestore сейчас нет;
- в `mcp-server` есть отдельная зеркальная статическая модель категорий.

Иными словами, категория сейчас живет не как запись в базе, а как кодовый каталог, который используется для:

- выбора категории при создании расхода;
- отображения названия, цвета и иконки;
- фильтрации;
- расчета budget / non-budget логики;
- MCP-валидации и выдачи списка допустимых категорий.

## 2. Где категории описаны

### 2.1 Клиентский source of truth

Основной список категорий находится в:

- [src/app/common/model/categories.ts](../src/app/common/model/categories.ts)

Там определены:

- `Category`
- `Categories`
- `getCategoryNameById(id)`
- `getCategoryById(id)`

Каждая категория содержит:

- `id`
- `name`
- `icon`
- `color`
- `includeInBalance`

### 2.2 Серверная зеркальная модель

В `mcp-server` есть свой отдельный справочник:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)

Там категории заданы как `CATEGORY_DEFINITIONS` и используются для:

- типа `CategoryId`
- canonicalization расходов
- дефолтного расчета `includeInBalance`

То есть сейчас в проекте есть две копии одного и того же справочника:

- клиентская
- MCP-серверная

## 3. Как категории хранятся в данных

### 3.1 В модели расхода

Расход хранит категорию как строку:

- [src/app/common/model/expense.model.ts](../src/app/common/model/expense.model.ts)

Поле:

```ts
category: string;
```

То есть в самом `Expense` нет вложенного объекта категории.

### 3.2 Что дополнительно копируется в расход

Кроме `category`, в расход копируется `includeInBalance`.

Это происходит при создании расхода в:

- [src/app/expense/expense.component.ts](../src/app/expense/expense.component.ts)

Логика такая:

- пользователь выбирает `category.id`;
- код ищет категорию через `getCategoryById(...)`;
- берет оттуда `includeInBalance`;
- записывает это значение в сам расход.

Это важный архитектурный момент: дальнейшая бюджетная логика часто читает уже `expense.includeInBalance`, а не только метаданные категории.

### 3.3 Где физически хранятся расходы

#### Firestore

Онлайн-режим:

- [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts)

Расходы пишутся в коллекцию `expenses`.

Категория в документе расхода сохраняется как:

- `category: string`
- `includeInBalance?: boolean`

Отдельная коллекция категорий не используется.

#### localStorage

Локальный fallback:

- [src/app/common/service/expense-store.service.ts](../src/app/common/service/expense-store.service.ts)

Расходы хранятся в `localStorage` под ключом `expenses`.

Там также лежит только `category` id внутри расхода, без отдельного каталога категорий.

## 4. Как категории получают

### 4.1 В UI

Большинство клиентского кода получает категории напрямую импортом:

- `import { Categories } ...`
- `import { getCategoryById } ...`
- `import { getCategoryNameById } ...`

То есть сейчас нет отдельного `CategoryService`, нет запроса в Firestore и нет асинхронной загрузки каталога.

### 4.2 В MCP server

`mcp-server` не читает категории из Firestore.

Он берет их из статической константы:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)

И отдельно отдает их через tool:

- [mcp-server/src/tools/list-categories.ts](../mcp-server/src/tools/list-categories.ts)

## 5. Как категории отображаются в UI

### 5.1 Экран добавления расхода

Сетка категорий находится в:

- [src/app/common/component/category/categories.component.ts](../src/app/common/component/category/categories.component.ts)
- [src/app/common/component/category/categories.component.html](../src/app/common/component/category/categories.component.html)

Поведение:

- компонент берет `categories: Category[] = [...Categories]`;
- рисует иконку и имя;
- на клик эмитит `category.id`;
- в collapsed state может показывать только часть списка;
- в expanded state показывает весь каталог.

Важная деталь:

- цвет иконки включается только если введена сумма;
- сам компонент ничего не знает о Firestore или расходах, он только возвращает выбранный `id`.

### 5.2 История расходов

Категория в history отображается по `id` через helper:

- [src/app/history/item/history-item.component.ts](../src/app/history/item/history-item.component.ts)
- [src/app/history/item/history-item.component.html](../src/app/history/item/history-item.component.html)

Здесь:

- `getCategoryNameById(item.category)` выводит имя;
- category label кликабелен и может запускать фильтр по категории.

### 5.3 Модалка редактирования расхода

Для редактирования используется статический список:

- [src/app/history/edit/expense-edit-modal.component.ts](../src/app/history/edit/expense-edit-modal.component.ts)

Там есть:

- `readonly categories: Category[] = Categories`

То есть выбор категории в edit flow тоже полностью основан на локальном каталоге.

### 5.4 Фильтр категорий

Компонент фильтра:

- [src/app/common/component/filter/category/category-filter.component.ts](../src/app/common/component/filter/category/category-filter.component.ts)
- [src/app/common/component/filter/category/category-filter.component.html](../src/app/common/component/filter/category/category-filter.component.html)

Как он устроен:

- строит чекбоксы из `Categories`;
- делит их на:
  - `regular = !includeInBalance`
  - `irregular = includeInBalance`
- эмитит `string[]` с выбранными `category.id`;
- если выбраны все категории, нормализует это к `[]`, то есть "фильтр не задан".

Это важно: логическая группировка "Регулярное / Нерегулярное" завязана не на отдельное поле `type`, а прямо на `includeInBalance`.

## 6. Как категории участвуют в логике

### 6.1 При создании расхода

Поток выглядит так:

1. пользователь нажимает на категорию;
2. `CategoriesComponent` эмитит `category.id`;
3. [src/app/expense/expense.component.ts](../src/app/expense/expense.component.ts) собирает `Expense`;
4. `includeInBalance` подтягивается из `getCategoryById(categoryId)`;
5. расход уходит в `ExpenseService.addExpense(...)`.

### 6.2 При получении расходов

Сервис расходов фильтрует по category id:

- [src/app/common/service/expense.service.ts](../src/app/common/service/expense.service.ts)
- [src/app/common/service/expense-store.service.ts](../src/app/common/service/expense-store.service.ts)

В Firestore:

- используется `where('category', 'in', categoryIds)`, если фильтр задан.

В local fallback:

- идет обычная клиентская фильтрация `category.includes(expense.category)`.

### 6.3 В budget / balance логике

Главный смысл категории сейчас не только в названии, а в `includeInBalance`.

Это поле влияет на:

- budget/non-budget фильтр;
- периодические summary;
- календарные суммы;
- statistics, где часть графиков рассматривает только irregular категории.

Примеры мест:

- [src/app/common/model/balance-filter.model.ts](../src/app/common/model/balance-filter.model.ts)
- [src/app/common/model/budget-summary/budget-summary.classifier.ts](../src/app/common/model/budget-summary/budget-summary.classifier.ts)
- [src/app/period-summary/utils/period-summary.classifier.ts](../src/app/period-summary/utils/period-summary.classifier.ts)
- [src/app/common/calendar/calendar.component.ts](../src/app/common/calendar/calendar.component.ts)
- [src/app/period-summary/irregular/irregular-charts.utils.ts](../src/app/period-summary/irregular/irregular-charts.utils.ts)

### 6.4 В statistics

`statistics` используют категории очень активно:

- [src/app/statistics/statistics.component.ts](../src/app/statistics/statistics.component.ts)
- [src/app/statistics/functions/category-analytics.service.ts](../src/app/statistics/functions/category-analytics.service.ts)
- [src/app/statistics/bar/statistics-bar.component.ts](../src/app/statistics/bar/statistics-bar.component.ts)

Там категории нужны для:

- построения списка включенных/исключенных категорий;
- группировки regular/irregular;
- преобразования `id -> name`;
- определения `includeInBalance` у категории.

## 7. Как категории используются в MCP

### 7.1 Валидация допустимых category id

В `mcp-server` список ids превращается в enum schema:

- [mcp-server/src/domain/schemas.ts](../mcp-server/src/domain/schemas.ts)

Это означает:

- category id в MCP-tools сейчас не динамический;
- все допустимые значения известны на этапе запуска сервера;
- неизвестная категория не пройдет schema validation.

### 7.2 Канонизация расходов

В:

- [mcp-server/src/domain/models.ts](../mcp-server/src/domain/models.ts)

`canonicalizeExpense(...)` использует категорию, чтобы:

- нормализовать расход;
- подставить дефолтный `includeInBalance`, если он не был передан явно.

### 7.3 Публичная выдача списка категорий

Tool:

- [mcp-server/src/tools/list-categories.ts](../mcp-server/src/tools/list-categories.ts)

возвращает:

- `count`
- `categories`

Это read-only отражение статического списка.

## 8. Важные нюансы и ограничения текущей модели

### 8.1 Категории не являются пользовательскими данными

Сейчас пользователь не может:

- добавить категорию;
- удалить категорию;
- переименовать категорию;
- менять `icon`, `color`, `includeInBalance`.

Потому что для этого просто нет отдельного хранилища и CRUD-модели.

### 8.2 Есть расхождение между клиентом и MCP по полноте данных

В клиенте категория содержит:

- `id`
- `name`
- `icon`
- `color`
- `includeInBalance`

В `mcp-server` категория сейчас содержит только:

- `id`
- `name`
- `includeInBalance`

То есть UI-метаданные не синхронизируются с MCP.

### 8.3 Изменение category у расхода не обязательно автоматически меняет смысл budget flag

Поскольку `includeInBalance` хранится в самом расходе, изменение `category` у уже существующего расхода - это не просто rename ссылки.

Если код отдельно не пересчитает `includeInBalance`, старый budget flag может сохраниться.

Это поведение нужно учитывать при любой будущей миграции категорий.

### 8.4 Категории требуются синхронно

Сейчас много кода предполагает, что каталог доступен сразу:

- через direct import;
- без подписок;
- без loading state;
- без remote fetch.

Это одна из главных причин, почему перенос категорий в Firebase затронет не только storage, но и архитектуру получения данных.

## 9. Bottom Line

Категории в проекте сейчас устроены как статический кодовый справочник, который:

- описан локально в клиенте;
- зеркально продублирован в `mcp-server`;
- хранится в расходах только как `category` id;
- участвует в budget логике через `includeInBalance`;
- используется в UI напрямую, без отдельного сервиса и без загрузки из базы.

Если коротко: сегодня категория - это не документ в базе, а часть доменной модели приложения.
