# Categories Testing Plan

## 1. Scope

План покрывает resolved-каталог категорий, Firestore overrides, локальный кэш,
клиентские CRUD/UI-потоки и MCP server.

## 2. Unit Tests

### Model And Merge

- дефолт без override остается неизменным;
- partial default override наследует отсутствующие поля из файла;
- rename, icon, color и `includeInBalance` применяются поверх дефолта;
- hidden default отсутствует в active view, но остается в historical lookup;
- active и archived custom categories корректно сливаются и сортируются;
- malformed custom document и custom id, совпадающий с default id, игнорируются;
- неизвестный id отображается как `Unknown category (<id>)`.

### Validation And Store

- имя нормализуется по trim, whitespace и case;
- duplicate active name отклоняется, hidden name не блокирует create;
- invalid icon, color и `includeInBalance` отклоняются;
- cache key изолирован по uid и anonymous scope;
- optimistic create/update/hide/archive/restore обновляет subjects;
- failed Firestore write откатывает optimistic state;
- замена remote snapshot удаляет устаревшие cached overrides.

### Expense Semantics

- новый расход получает текущий category `includeInBalance` snapshot;
- смена category id в edit flow обновляет snapshot;
- изменение только amount/description/date сохраняет старый snapshot;
- изменение category override не пересчитывает старые расходы;
- filter с более чем 30 category ids не создает недопустимый Firestore `in` query.

### MCP

- resolved provider объединяет defaults, overrides и custom categories;
- hidden/unknown category отклоняется для create/update;
- `list_categories` возвращает только active resolved view;
- custom ids проходят schema validation;
- create/update сохраняет resolved `includeInBalance`;
- repository читает только `users/{ownerUid}/category-overrides`.

## 3. Firestore Emulator Tests

- user A не читает и не изменяет overrides user B;
- anonymous read/write запрещен;
- штатные операции `expenses`, `tags`, `balance`, `balance-date`,
  `irregularBudget` и `savings` остаются разрешены владельцу;
- create/update не могут подменить `uid` в top-level user-owned documents;
- authenticated offline read получает uid-scoped cache;
- offline write синхронизируется после reconnect;
- logout/login A -> B не показывает cache пользователя A;
- последовательность первого запуска: defaults -> local cache -> Firestore snapshot.

## 4. Browser Matrix

### Category Settings

- вкладка Categories не блокирует страницу при загрузке;
- active и hidden sections отображают source и balance badge;
- create custom category отражается в settings и expense picker;
- duplicate normalized name показывает локальную ошибку;
- edit обновляет name/icon/color и только будущую balance semantics;
- hide/restore default и archive/restore custom работают без потери history label;
- per-card saving/error state не блокирует остальные карточки;
- desktop и mobile layout не имеют horizontal overflow.

### Runtime Consumers

- create picker показывает active resolved categories;
- edit modal показывает active categories и текущую hidden category старого расхода;
- history, statistics, calendar и period summary показывают renamed/custom/hidden names;
- category filter включает custom active categories и сохраняет `[] = all`;
- regular/irregular totals используют `expense.includeInBalance`, а не текущий override;
- unknown historical category не ломает экран и получает placeholder.

### MCP End-To-End

- `list_categories` совпадает с active UI catalog для того же пользователя;
- `create_expense` принимает custom id и запись появляется в UI;
- `update_expense` меняет category и snapshot;
- hidden и unknown id возвращают handled `invalid_input`.

## 5. Acceptance Criteria

- runtime UI не импортирует статический `Categories` напрямую;
- client unit suite, production build и MCP suite проходят;
- Firestore rules проходят emulator tenant-isolation tests;
- browser matrix проходит в authenticated, anonymous и offline режимах;
- старые расходы сохраняют budget/statistics classification после category edit;
- в рабочем каталоге нет случайных generated build artifacts.

## 6. Current Verification

- client unit tests: 25 passed;
- client TypeScript app/spec compile: passed;
- production Angular build: passed with non-blocking size/CommonJS warnings;
- MCP tests: 9 passed;
- MCP TypeScript compile: passed;
- authenticated browser smoke: settings, duplicate validation, editor, picker,
  history filter and statistics passed;
- live Firestore mutation and emulator rules tests intentionally не выполнялись
  против реального пользовательского аккаунта без отдельной test fixture/project.
