# Manage Categories In Export Plan

## 1. Goal

Добавить экран управления категориями внутри `/expenses/#/export` так, чтобы:

- он использовал уже существующую страницу настроек `Export`;
- пользователь мог управлять своей проекцией категорий;
- дефолтные категории по-прежнему оставались в файле;
- UI был простым для первой версии и не ломал текущую архитектуру.

Рекомендуемое место:

- новый tab `Categories` в [src/app/export/export.component.html](../src/app/export/export.component.html)

## 2. Why Export Page

Сейчас `/export` уже фактически является экраном настроек:

- `General`
- `Tags`
- `Budget`
- `Export`
- `Auth`
- `Swipe`
- `Reminders`

Это видно в:

- [src/app/export/export.component.html](../src/app/export/export.component.html)
- [src/app/export/export.component.ts](../src/app/export/export.component.ts)

Плюсы размещения `Manage categories` здесь:

- не нужен новый route;
- уже есть tab-based layout;
- уже есть паттерн для управления пользовательскими сущностями на вкладке `Tags`;
- меньше навигационного шума.

## 3. Recommended Product Scope For v1

Для первой версии рекомендую сделать `Manage categories` как отдельную вкладку со следующими возможностями:

- просмотр всех активных категорий пользователя;
- различение `default`, `custom`, `hidden`;
- создание новой custom category;
- редактирование:
  - `name`
  - `icon`
  - `color`
  - `includeInBalance`
- скрытие дефолтной категории;
- восстановление скрытой дефолтной категории;
- архивирование custom category вместо жесткого удаления, если она уже использовалась.

Что **не включать** в v1:

- drag-and-drop reorder;
- группировку по секциям внутри основного expense picker;
- массовое редактирование;
- сложный icon picker с сотнями иконок;
- миграцию существующих расходов между категориями.

## 4. Recommended UX

### 4.1 Tab Structure

В `ExportComponent` добавить новый tab:

- `Categories`

Порядок вкладок можно сделать таким:

- `General`
- `Tags`
- `Categories`
- `Budget`
- `Reminders`
- `Export`
- `Auth`
- `Swipe`

### 4.2 Layout Inside Categories Tab

Рекомендуемая структура:

1. блок `Add category`
2. блок `Active categories`
3. блок `Hidden categories`

### 4.3 Add Category Block

Минимальные поля:

- `name`
- `icon`
- `color`
- `includeInBalance`

Для v1 есть два практичных варианта:

- простой inline form;
- кнопка `Add category`, открывающая modal/form sheet.

Рекомендация:

- **v1: inline form**, потому что он быстрее в реализации и хорошо сочетается с текущим `Tags` tab.

### 4.4 Category List Item

Каждая категория в списке должна показывать:

- icon
- name
- `id`
- source:
  - `default`
  - `custom`
  - `modified`
- include/exclude badge для `includeInBalance`

Действия на карточке:

- `Edit`
- `Hide` для дефолтной категории
- `Archive` или `Delete` для custom категории
- `Restore` для hidden категории

### 4.5 Edit Interaction

Для редактирования рекомендую не делать сразу сложный inline editor в списке.

Лучший компромисс для этого экрана:

- список остается компактным;
- кнопка `Edit` открывает modal или prompt-like editor.

Рекомендация:

- **v1: modal editor**

Почему:

- список не разрастается;
- проще валидировать поля;
- удобнее для mobile;
- лучше масштабируется, если позже добавятся дополнительные поля.

## 5. UX Variants Considered

### Option A. Fully Inline Editing

Плюсы:

- быстрое редактирование;
- минимум переходов.

Минусы:

- экран быстро становится перегруженным;
- плохо работает на мобильном экране;
- сложнее поддерживать loading/validation states.

### Option B. Modal-Based Editing

Плюсы:

- чище UI;
- легче валидация;
- хорошо сочетается с текущим `Export` page.

Минусы:

- один дополнительный клик.

### Option C. Separate Manage Categories Route

Плюсы:

- больше пространства;
- легче масштабировать в полноценный settings screen.

Минусы:

- новый route;
- лишняя навигация;
- для v1 слишком тяжело.

### Recommendation

Для `/expenses/#/export` рекомендую:

- tab `Categories`
- inline add form
- compact category list
- modal edit

## 6. Data Semantics In UI

UI должен работать с resolved categories из `CategoryService`, а не напрямую со статическим `Categories`.

Каждая категория должна иметь понятный статус:

- `default`
- `default-override`
- `custom`
- `hidden`

Правила действий:

- дефолтную категорию нельзя физически удалить;
- скрытие дефолтной категории создает override `isDeleted = true`;
- редактирование дефолтной категории создает или обновляет override;
- custom категория создается отдельным документом;
- если custom категория уже использовалась в расходах, лучше архивировать ее, а не удалять бесследно.

## 7. Proposed UI States

### 7.1 Loading

Если categories еще не загружены:

- показывать local spinner или skeleton только внутри tab content;
- не блокировать весь `ExportComponent`.

### 7.2 Empty

Если у пользователя нет custom и hidden категорий:

- все равно показывать дефолтный список;
- текст для hidden секции: `No hidden categories`.

### 7.3 Saving

Во время create/update/hide/restore:

- блокировать только конкретную кнопку или карточку;
- не freeze весь список.

### 7.4 Error

Ошибки должны быть локальными:

- duplicate name;
- invalid icon;
- invalid color;
- network/firestore failure.

Для v1 допустим простой inline error text или `alert`, но предпочтительнее локальный hint под формой.

## 8. Validation Rules

Минимальные правила для v1:

- `name` обязателен;
- `name` после normalizing не должен быть пустым;
- дубликаты имен среди активных категорий запрещены;
- `color` должен быть валидным CSS color или hex;
- `icon` должен быть из поддерживаемого списка;
- `includeInBalance` обязателен как boolean flag.

Дополнительно:

- `id` для custom категории генерируется системой, а не вводится пользователем;
- hidden категории не участвуют в проверке уникальности активного списка, если не принято иное правило.

## 9. Recommended Component Structure

### 9.1 Export Page Integration

Изменения в:

- [src/app/export/export.component.ts](../src/app/export/export.component.ts)
- [src/app/export/export.component.html](../src/app/export/export.component.html)
- [src/app/export/export.component.scss](../src/app/export/export.component.scss)

Что добавить:

- `categories$`
- `hiddenCategories$` или derived grouping
- `categoryDraft`
- `editingCategory`
- handlers для add/edit/hide/restore/delete

### 9.2 New Category Settings Component

Рекомендую вынести UI в отдельный standalone component, а не раздувать `ExportComponent`.

Например:

- `src/app/export/category-settings/category-settings.component.ts`
- `src/app/export/category-settings/category-settings.component.html`
- `src/app/export/category-settings/category-settings.component.scss`

Почему:

- `ExportComponent` уже содержит много разнородной логики;
- категории заметно сложнее тегов;
- отдельный компонент упростит поддержку.

### 9.3 Optional Editor Component

Если modal-редактор будет отдельным:

- `src/app/export/category-editor/category-editor.component.ts`

Но для v1 можно оставить это внутри `category-settings` без отдельного файла, если хочется быстрее внедрить.

## 10. Service Layer Expectations

Этот экран должен опираться на будущий `CategoryService`.

Минимальный API:

```ts
getCategories(useCache?: boolean): Observable<ResolvedCategory[]>;
createCategory(input: CategoryInput): Observable<ResolvedCategory>;
updateCategory(id: string, patch: CategoryPatch): Observable<ResolvedCategory>;
hideCategory(id: string): Observable<string>;
restoreCategory(id: string): Observable<string>;
archiveCategory(id: string): Observable<string>;
```

Для UI это предпочтительнее, чем напрямую знать про структуру Firestore override документов.

## 11. Suggested Tab Content

Рекомендуемый outline:

```text
Categories
  Add category
    [name] [icon] [color] [includeInBalance] [Add]

  Active categories
    Meal          default      included   [Edit] [Hide]
    Travel        modified     included   [Edit] [Hide]
    Gifts         custom       excluded   [Edit] [Archive]

  Hidden categories
    Bus           default      hidden     [Restore]
```

## 12. Reuse Existing Tags Pattern

Вкладка `Tags` уже показывает полезный baseline:

- inline add
- list of items
- per-item actions

См.:

- [src/app/export/export.component.html](../src/app/export/export.component.html)
- [src/app/export/export.component.ts](../src/app/export/export.component.ts)

Для категорий стоит сохранить тот же общий паттерн, но сделать richer item layout:

- больше метаданных;
- различение default/custom;
- отдельный hidden section;
- более аккуратное редактирование.

## 13. Suggested Implementation Phases

### Phase 1. Infrastructure

- добавить `CategoryService`;
- собрать resolved categories;
- завести loading/error state;
- подготовить CRUD API.

### Phase 2. Export Tab

- добавить tab `Categories` в `ExportComponent`;
- подключить `CategorySettingsComponent`;
- показать active + hidden категории.

### Phase 3. Create And Edit

- добавить inline create form;
- добавить modal edit flow;
- добавить validation и local saving states.

### Phase 4. Hide / Restore / Archive

- добавить подтверждение на destructive actions;
- реализовать скрытие дефолтных;
- реализовать архивирование custom.

### Phase 5. Polish

- badges;
- icon/color preview;
- better error messages;
- skeleton state;
- mobile spacing.

## 14. Risks

- `ExportComponent` уже перегружен и без выноса в отдельный child component станет трудно поддерживаемым.
- Если сразу разрешить слишком много действий, UX станет сложным.
- Жесткое удаление категорий рискованно для истории расходов.
- Если категориями продолжит пользоваться статический код в других экранах, после редактирования пользователь может увидеть разное поведение в разных частях app.

## 15. Final Recommendation

Для `/expenses/#/export` рекомендую такой v1:

- новая вкладка `Categories`;
- отдельный `CategorySettingsComponent`;
- inline create form;
- compact list of active categories;
- отдельный hidden section;
- modal-based edit;
- hide/restore для дефолтных;
- archive вместо жесткого delete для custom.

Это даст:

- понятное место для управления категориями;
- минимальный навигационный overhead;
- хороший баланс между скоростью реализации и дальнейшей масштабируемостью.
