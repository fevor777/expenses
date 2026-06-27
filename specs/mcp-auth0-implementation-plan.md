# MCP Auth0 Implementation Plan

## 1. Goal

Перевести текущий remote MCP server для Expenses с fixed bearer token auth на OAuth-совместимую схему через Auth0, чтобы сервер можно было подключить в Claude web custom connector.

Итоговое поведение:
- Claude web connector использует OAuth flow вместо ручного `Authorization: Bearer <static-token>`.
- MCP server остаётся отдельным Cloud Run сервисом.
- Доступ к данным по-прежнему жёстко ограничен одним владельцем (`EXPENSES_OWNER_UID`).
- Firestore repositories и MCP tools не меняют бизнес-логику.

## 2. Current State

Сейчас сервер уже задеплоен и работает как remote MCP server:
- endpoint: `https://expenses-mcp-kxj4h4t3fq-ew.a.run.app/mcp`
- локальная CLI-конфигурация использует static bearer token в [.mcp.json](../.mcp.json)

Текущая auth-схема:
- [mcp-server/src/auth.ts](../mcp-server/src/auth.ts) проверяет один заранее известный bearer token
- [mcp-server/src/server.ts](../mcp-server/src/server.ts) вешает эту проверку на `/mcp`

Проблема:
- Claude web custom connector не поддерживает user-pasted static bearer token
- для web-подключения нужен OAuth-compatible flow

## 3. Scope

### Included

- Auth0 setup for OAuth login
- JWT validation in MCP server
- protected resource metadata для Claude connector discovery
- `401 + WWW-Authenticate` handshake
- Cloud Run redeploy with new env vars
- документация по настройке и проверке

### Excluded

- multi-tenant auth model
- смена Firestore data model
- переписывание MCP tools
- собственный OAuth server внутри `mcp-server/`

## 4. Target Architecture

```text
Claude web connector
        |
        | OAuth login
        v
Auth0
        |
        | access token (JWT)
        v
Cloud Run: expenses-mcp
        |
        | Firebase Admin SDK
        v
Firestore
```

Ключевой принцип:
- Auth0 отвечает за login и выдачу access token
- `expenses-mcp` выступает как protected resource и валидирует JWT
- owner scoping остаётся внутри MCP runtime через `EXPENSES_OWNER_UID`

## 5. Auth0 Setup

### 5.1 Create API

В Auth0 создать API:
- Name: `Expenses MCP API`
- Identifier: точный MCP URL, например `https://expenses-mcp-kxj4h4t3fq-ew.a.run.app/mcp`
- Scopes:
  - `expenses.read`
  - `expenses.write`

Почему identifier должен совпадать с MCP URL:
- это упростит `audience` validation
- `resource` в protected resource metadata будет совпадать с реальным MCP endpoint

### 5.2 Create Application

В Auth0 создать Application:
- Type: `Regular Web Application`

Разрешённый callback URL:
- `https://claude.ai/api/mcp/auth_callback`

Сохранить значения:
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

### 5.3 Owner Restriction

Для single-user v1 сервер должен принимать только токены владельца.

Рекомендуемый способ:
- ограничить доступ по `email` claim через env var `AUTH_ALLOWED_EMAIL`

Альтернатива:
- ограничить по `sub` через `AUTH_ALLOWED_SUB`

Рекомендуется начать с `AUTH_ALLOWED_EMAIL`, если Auth0 reliably включает email в токен.

## 6. Code Changes

## 6.1 Config Layer

Обновить [mcp-server/src/config.ts](../mcp-server/src/config.ts):

Добавить env vars:
- `AUTH_MODE` = `bearer` | `oauth` | `both`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_ALLOWED_EMAIL`
- `AUTH_ALLOWED_SUB`

Поведение:
- на переходный период поддерживать `AUTH_MODE=both`
- после полной миграции можно перейти на `AUTH_MODE=oauth`

`MCP_BEARER_TOKEN` не удалять сразу, пока не завершена миграция.

## 6.2 Auth Middleware

Обновить [mcp-server/src/auth.ts](../mcp-server/src/auth.ts):

Заменить fixed shared-secret middleware на JWT validation middleware.

Новый middleware должен:
- читать `Authorization: Bearer <jwt>`
- валидировать `iss`
- валидировать `aud`
- валидировать срок жизни токена
- при наличии owner restriction проверять `email` или `sub`

Технически удобно использовать:
- `jose`

Новый auth слой должен уметь два режима:
- legacy static bearer
- Auth0 JWT

Это позволит не ломать текущую CLI-конфигурацию до конца миграции.

## 6.3 MCP Resource Handshake

Обновить [mcp-server/src/server.ts](../mcp-server/src/server.ts):

### Добавить protected resource metadata endpoint

Добавить endpoint:
- `GET /.well-known/oauth-protected-resource/mcp`

Он должен возвращать JSON вида:

```json
{
  "resource": "https://expenses-mcp-kxj4h4t3fq-ew.a.run.app/mcp",
  "authorization_servers": ["https://YOUR_AUTH0_DOMAIN/"],
  "bearer_methods_supported": ["header"],
  "scopes_supported": ["expenses.read", "expenses.write"],
  "resource_name": "Expenses MCP"
}
```

Требование:
- поле `resource` должно точно совпадать с тем URL, который будет введён в Claude connector UI

### Добавить правильный 401 challenge

Если запрос к `/mcp` пришёл без валидного токена, сервер должен отдавать:
- HTTP `401 Unauthorized`
- header `WWW-Authenticate: Bearer resource_metadata="https://<host>/.well-known/oauth-protected-resource/mcp"`

Это нужно, чтобы Claude web понял, где искать auth metadata.

## 6.4 Logging

Обновить `buildCallerFingerprint` в [mcp-server/src/auth.ts](../mcp-server/src/auth.ts):
- перестать полагаться только на raw bearer string
- для OAuth можно fingerprint'ить `sub` + IP или `email` + IP

## 6.5 Dependencies

Добавить в [mcp-server/package.json](../mcp-server/package.json):
- `jose`

Если потребуется JWKS helper abstraction, можно добавить отдельный helper file без роста зависимостей.

## 7. Files Expected To Change

### Must change

- [mcp-server/src/config.ts](../mcp-server/src/config.ts)
- [mcp-server/src/auth.ts](../mcp-server/src/auth.ts)
- [mcp-server/src/server.ts](../mcp-server/src/server.ts)
- [mcp-server/package.json](../mcp-server/package.json)
- [mcp-server/README.md](../mcp-server/README.md)
- [scripts/deploy-mcp-cloud-run.sh](../scripts/deploy-mcp-cloud-run.sh)

### Likely new files

- `mcp-server/src/oauth.ts` or `mcp-server/src/auth/jwt.ts`
- `mcp-server/src/oauth-metadata.ts`

### Should stay unchanged

- [mcp-server/src/firestore/expenses.repository.ts](../mcp-server/src/firestore/expenses.repository.ts)
- [mcp-server/src/firestore/settings.repository.ts](../mcp-server/src/firestore/settings.repository.ts)
- [mcp-server/src/tools/list-expenses.ts](../mcp-server/src/tools/list-expenses.ts)
- [mcp-server/src/tools/get-expense.ts](../mcp-server/src/tools/get-expense.ts)
- [mcp-server/src/tools/monthly-summary.ts](../mcp-server/src/tools/monthly-summary.ts)
- остальной MCP tool layer

## 8. Deployment Changes

Обновить Cloud Run env vars:
- `AUTH_MODE=oauth` or `both`
- `AUTH_ISSUER=https://YOUR_AUTH0_DOMAIN/`
- `AUTH_AUDIENCE=https://expenses-mcp-kxj4h4t3fq-ew.a.run.app/mcp`
- `AUTH_ALLOWED_EMAIL=<owner-email>` or `AUTH_ALLOWED_SUB=<owner-sub>`

Удалять `MCP_BEARER_TOKEN` можно только после подтверждённой работы OAuth path.

Deploy strategy:
1. first deploy with `AUTH_MODE=both`
2. verify Claude web connector
3. verify existing CLI still works
4. optionally remove legacy bearer flow later

## 9. Validation Plan

### 9.1 Build validation

```bash
cd /Users/home/workspace/expenses
npm run mcp:build
```

### 9.2 Unauthenticated handshake

Проверить, что `/mcp` без токена возвращает `401` и `WWW-Authenticate`.

### 9.3 Metadata discovery

Проверить:
- `GET /.well-known/oauth-protected-resource/mcp`
- `resource` совпадает с MCP URL
- `authorization_servers[0]` указывает на Auth0 issuer

### 9.4 OAuth connector test in Claude web

В форме connector заполнить:
- Name: `Expenses MCP`
- Remote MCP server URL: `https://expenses-mcp-kxj4h4t3fq-ew.a.run.app/mcp`
- OAuth Client ID: из Auth0
- OAuth Client Secret: из Auth0

Ожидаемое поведение:
- Claude открывает OAuth flow
- login проходит через Auth0
- connector успешно подключается

### 9.5 Tool validation

Проверить минимум:
- `tools/list`
- `monthly_summary`
- `list_expenses`

### 9.6 Negative validation

Проверить, что:
- токен другого пользователя не проходит owner restriction
- невалидный JWT получает `401`
- старый static bearer путь работает только если `AUTH_MODE=both`

## 10. Risks

### Email claim may be missing

Если Auth0 access token не содержит email, owner restriction по email не сработает.
Fallback:
- использовать `AUTH_ALLOWED_SUB`

### Resource URL mismatch

Если `resource` в metadata не совпадает с URL, введённым в Claude, connector auth может не завершиться.

### Old CLI config can break

Сейчас [.mcp.json](../.mcp.json) использует static bearer token.
Если сразу убрать legacy mode, текущий локальный CLI flow сломается.

### Wrong callback URL in Auth0

Для Claude web нужен ровно:
- `https://claude.ai/api/mcp/auth_callback`

## 11. Recommended Execution Order

1. Создать API и Application в Auth0
2. Зафиксировать `AUTH_ISSUER`, `AUTH_AUDIENCE`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
3. Обновить `config.ts`
4. Реализовать JWT auth middleware
5. Добавить metadata endpoint и `401` challenge
6. Обновить deploy script и README
7. Задеплоить с `AUTH_MODE=both`
8. Протестировать Claude web connector
9. После успешной проверки решить, оставлять ли legacy bearer mode

## 12. Definition of Done

Миграция считается завершённой, когда:
- Claude web custom connector подключается по URL MCP сервера
- OAuth login проходит через Auth0
- `list_expenses` и `monthly_summary` работают через Claude
- owner restriction не позволяет зайти другому пользователю
- Cloud Run работает стабильно после redeploy
- README и deploy instructions обновлены под новый auth flow