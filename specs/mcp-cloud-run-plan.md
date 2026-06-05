# MCP Cloud Run Technical Plan

## 1. Goal

Сделать отдельный remote MCP server для приложения Expenses, чтобы подключать его в ChatGPT и Claude через hosted HTTPS endpoint.

Ограничения текущего проекта:
- UI остаётся на GitHub Pages.
- Данные остаются в Firebase / Firestore.
- Android WebView и текущий Angular UI не должны зависеть от MCP runtime.
- Первая версия рассчитана на одного владельца сервера.

## 2. Why Cloud Run

Cloud Run здесь лучше, чем GitHub Pages и в большинстве случаев лучше, чем Firebase Functions.

Почему:
- GitHub Pages не подходит: это статический хостинг, а MCP требует живой серверный runtime.
- Cloud Run лучше подходит для отдельного remote MCP server, чем текущая Firebase Functions заготовка.
- Проще контролировать transport, auth, release cycle, scaling и observability.
- Можно держать MCP как отдельный сервис, не смешивая его с Angular UI и не ломая текущую схему деплоя.

Рекомендуемый target:
- Hosting: Cloud Run
- Data access: Firestore через Firebase Admin SDK
- Auth: personal bearer token для первой версии
- Transport: Streamable HTTP как основной, HTTP/SSE как дополнительный только если потребуется клиентская совместимость

## 3. Target Architecture

```text
ChatGPT / Claude
        |
        | HTTPS + MCP transport
        v
Cloud Run service: expenses-mcp
        |
        | Firebase Admin SDK
        v
Firestore

GitHub Pages UI (Angular) ---- independent ----> Firestore / Firebase Auth
Android WebView ----------- independent ----> Firestore / Firebase Auth
```

Ключевая идея:
- MCP server не должен жить внутри GitHub Pages.
- MCP server не должен зависеть от browser auth из Angular приложения.
- MCP server должен иметь свой server-side контур авторизации.

## 4. Recommended Repository Layout

Рекомендуется добавить отдельный runtime рядом с существующими `functions/`:

```text
mcp-server/
  package.json
  tsconfig.json
  src/
    index.ts
    server.ts
    auth.ts
    config.ts
    firestore/
      client.ts
      expenses.repository.ts
    tools/
      list-expenses.ts
      get-expense.ts
      search-expenses.ts
      create-expense.ts
      update-expense.ts
      monthly-summary.ts
      export-expenses.ts
    domain/
      filters.ts
      summaries.ts
      schemas.ts
```

Почему отдельная папка:
- Текущий `functions/` runtime минимальный и ориентирован на Cloud Functions.
- MCP лучше выпускать и деплоить независимо.
- Можно выбрать современный Node runtime без жёсткой привязки к текущему backend слою.

## 5. Runtime Stack

Рекомендуемый стек для `mcp-server/`:
- Node.js 20 LTS
- TypeScript
- `@modelcontextprotocol/sdk`
- `firebase-admin`
- `zod` для входных схем
- `pino` или аналог для структурированного логирования

Принципы:
- Не тащить Angular code в MCP runtime.
- Не использовать клиентский Firebase SDK.
- Всю работу с Firestore делать через Admin SDK.

## 6. Transport Strategy

Для OpenAI remote MCP documented transport expectations включают:
- Streamable HTTP
- HTTP/SSE

Рекомендация для первой версии:
- Основной transport: Streamable HTTP
- Один публичный HTTPS endpoint на Cloud Run
- SSE добавлять только если целевой клиент реально требует именно его

Причина:
- Меньше движущихся частей
- Проще reverse proxy и логирование
- Лучше контролируется на Cloud Run

## 7. Authentication Model

### 7.1 Recommended v1 auth

Так как сервер нужен только вам, самый простой и надёжный вариант:
- сервер публикуется в интернет как HTTPS endpoint;
- каждый запрос к MCP серверу должен нести `Authorization: Bearer <token>`;
- токен хранится в Secret Manager и проверяется сервером;
- сервер не принимает browser session cookies и не зависит от Firebase client auth.

### 7.2 Why not Firebase end-user auth for v1

Не стоит строить v1 вокруг логина из Angular UI:
- ChatGPT / Claude должны подключаться к серверу вне браузерного контекста;
- browser-only auth flow неудобен для hosted MCP;
- MCP серверу нужен стабильный server-side security boundary.

### 7.3 User scoping

Так как пользователей пока нет, лучший вариант для v1:
- сервер жёстко привязан к одному Firebase uid владельца;
- `OWNER_UID` хранится в конфиге;
- все Firestore запросы идут только в рамках этого uid.

Это сильно упрощает дизайн:
- не нужно маппить внешнюю identity в Firebase users;
- не нужно строить multi-tenant auth слой;
- исключается риск чтения чужих данных при ошибке в аргументах tool calls.

## 8. Configuration

Рекомендуемые env vars / secrets:
- `FIREBASE_PROJECT_ID`
- `EXPENSES_OWNER_UID`
- `MCP_BEARER_TOKEN`
- `LOG_LEVEL`
- `PORT`

Если Cloud Run использует service account внутри того же GCP проекта, отдельный JSON service account key не нужен.

Рекомендуемый service account:
- отдельный runtime service account для MCP
- только нужные Firestore permissions
- без лишних admin ролей вне Firestore

## 9. Firestore Access Model

### 9.1 Collections

Ожидаемые источники данных:
- `expenses`
- `balance`
- `irregularBudget`
- `savings`

### 9.2 Access rules inside MCP

Каждый repository layer должен автоматически добавлять owner uid в запросы.

Примерно так:
- `list_expenses` читает только документы `expenses` где `uid == OWNER_UID`
- `create_expense` записывает документ с `uid = OWNER_UID`
- `update_expense` сначала проверяет принадлежность записи `OWNER_UID`

### 9.3 Semantics parity

MCP должен повторять бизнес-семантику текущего приложения:
- date filtering
- category filtering
- description substring filtering
- summary calculations
- budget-related metrics

Нельзя делать отдельную несовместимую логику фильтрации только для MCP.

## 10. Tool Set for v1

### 10.1 Read tools

`list_expenses`
- Возвращает список расходов за диапазон дат
- Поддерживает category filter и description substring

`get_expense`
- Возвращает одну запись по id

`search_expenses`
- Поиск по комбинации фильтров
- Можно сделать alias к `list_expenses`, если не нужен отдельный tool

`monthly_summary`
- Возвращает totals за месяц
- Включает irregular spend, remaining budget, optional category breakdown

`export_expenses`
- Возвращает набор данных для экспорта
- Формат первой версии лучше сделать JSON
- CSV можно добавить позже как отдельный output mode

### 10.2 Mutating tools

`create_expense`
- Создаёт расход
- Валидирует amount, category, date, description
- Автоматически проставляет `uid = OWNER_UID`

`update_expense`
- Обновляет только разрешённые поля
- Проверяет принадлежность записи владельцу

### 10.3 Out of scope for v1

Не включать на старте:
- bulk delete
- admin tools
- массовые изменения бюджета
- destructive migration tools

## 11. Tool Contracts

Все tools должны иметь строгие JSON schema input contracts.

Минимальные правила:
- `amount` больше нуля
- `date` в epoch ms
- `description` опциональна и ограничена по длине
- `category` только из разрешённого набора
- неизвестные поля запрещены

Все мутации должны возвращать:
- итоговый статус
- id затронутой записи
- canonical server representation сохранённого документа

## 12. Safety Rules

### 12.1 Approval policy

Для подключения в ChatGPT / OpenAI tools layer:
- read-only tools можно разрешать без approval после проверки
- mutating tools лучше запускать с approval

### 12.2 Logging

Логировать:
- tool name
- high-level outcome
- latency
- caller fingerprint без хранения чувствительных токенов

Не логировать:
- bearer token
- полные секреты
- лишние персональные данные вне операционной необходимости

### 12.3 Rate limiting

Для персонального v1 достаточно:
- простой app-level throttling
- ограничение размера запросов
- ограничение числа документов в одном ответе

## 13. Cloud Run Deployment Plan

### 13.1 Service settings

Рекомендуемые стартовые настройки:
- region: тот же регион, где удобнее держать backend рядом с Firestore
- ingress: all
- authentication at platform level: allow unauthenticated
- application-level auth: mandatory bearer token
- min instances: 0
- max instances: низкий лимит для старта
- concurrency: умеренный уровень, например 10-20

Причина `allow unauthenticated`:
- ChatGPT / Claude должны иметь возможность достучаться до публичного endpoint;
- контроль доступа в этом кейсе происходит на уровне bearer token.

### 13.2 Secrets

Секреты хранить в Google Secret Manager:
- `MCP_BEARER_TOKEN`
- при необходимости дополнительные integration secrets

### 13.3 URL

Итоговый service URL Cloud Run и будет `server_url` для MCP integration.

Пример вида:
- `https://expenses-mcp-xxxxx-uc.a.run.app/mcp`

## 14. CI/CD Plan

Рекомендуемый pipeline:
- отдельный build для `mcp-server/`
- Docker image build
- deploy в Cloud Run
- smoke test на `list_tools`

Рекомендуется не смешивать этот pipeline с `npm run pp`, потому что `pp` относится к GitHub Pages UI.

## 15. Recommended Rollout

### Phase 1

Сделать только:
- `list_expenses`
- `get_expense`
- `monthly_summary`

Цель:
- проверить transport
- проверить auth
- проверить совместимость клиента

### Phase 2

Добавить:
- `create_expense`
- `update_expense`

Цель:
- добавить реальные actions
- держать approval на mutating tools

### Phase 3

Добавить:
- `export_expenses`
- расширенные summaries
- category breakdowns

## 16. Suggested Implementation Sequence

1. Создать `mcp-server/` как отдельный Node/TypeScript runtime.
2. Подключить Firebase Admin SDK.
3. Реализовать bearer auth middleware.
4. Реализовать `list_tools` и один read-only tool.
5. Протестировать локально через MCP inspector.
6. Задеплоить в Cloud Run.
7. Подключить endpoint в ChatGPT.
8. После успешной проверки добавить mutating tools.

## 17. Validation Checklist

Перед продом должно быть подтверждено:
- endpoint доступен по HTTPS
- bearer auth работает
- `list_tools` отвечает стабильно
- read-only tools возвращают данные только владельца
- mutating tools не работают без approval policy на стороне клиента
- ответы MCP совпадают по смыслу с UI приложения на одном и том же наборе данных

## 18. Decision Summary

Итоговая рекомендация:
- делать MCP как отдельный Cloud Run сервис;
- не хостить его на GitHub Pages;
- не завязывать v1 на browser Firebase auth;
- привязать v1 к одному `OWNER_UID`;
- начать с read-only tools и summary, затем добавить create/update.

Это минимальный и устойчивый путь, который подходит под ваш текущий стек и under-control для подключения из ChatGPT или Claude.