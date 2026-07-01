# Expenses MCP Server

Standalone MCP runtime for the Expenses app. It exposes Firestore-backed tools over a hosted HTTP endpoint so ChatGPT or Claude can connect without depending on the Angular UI or browser auth.

## What it serves

- `list_expenses`
- `get_expense`
- `delete_expense`
- `budget_summary`
- `budget_period_summary`
- `monthly_summary`
- `month_period_summary`
- `list_categories`
- `list_tags`
- `get_budget`
- `update_budget`
- `get_savings`
- `update_savings`
- `create_tag`
- `update_tag`
- `delete_tag`
- `create_expense`
- `update_expense`

Expense tools that create, update, or list expenses also support `tagIds`, so MCP clients can attach existing tags to expenses and filter by them.

In `AUTH_MODE=oauth`, the server resolves the authenticated OAuth user to a Firebase user and scopes all queries to that Firebase uid. In legacy bearer mode, queries remain hard-scoped to `EXPENSES_OWNER_UID`.

## Prompt templates

- `analyze_expenses_today`
- `analyze_expenses_yesterday`
- `analyze_expenses_week`
- `analyze_expenses_month`

These prompts return reusable Russian-language analysis instructions for ChatGPT-compatible MCP clients. Each prompt tells the client to call `list_expenses` for the requested period and for the previous comparable period so the response includes a direct comparison.

Budget-oriented summary tools use budget semantics, not calendar-month semantics:

- remaining budget is calculated only from expenses where `includeInBalance = true`
- the active budget frame comes from the configured budget start date and period length
- therefore the budget period may start/end on dates that do not match the start/end of a calendar month

`monthly_summary` is different: it returns a current calendar month summary and is not tied to budget settings.

`month_period_summary` returns a full arbitrary calendar month by `year` and `month`, also independent from budget settings.

## Environment

Required:

- `AUTH_MODE` with one of `bearer`, `oauth`, `both`

Optional:

- `MCP_BEARER_TOKEN`
- `AUTH_ISSUER`
- `AUTH_AUDIENCE`
- `AUTH_AUTHORIZATION_SERVER`
- `AUTH_JWKS_URI`
- `AUTH_BROKER_MODE`
- `AUTH_BROKER_CLIENT_ID`
- `AUTH_BROKER_CLIENT_SECRET`
- `AUTH_BROKER_ALLOWED_REDIRECT_URIS`
- `AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES`
- `AUTH_BROKER_BOOTSTRAP_CLIENTS`
- `AUTH_BROKER_ENABLE_DCR`
- `AUTH_BROKER_JWT_PRIVATE_KEY`
- `AUTH_BROKER_JWT_KEY_ID`
- `AUTH_BROKER_GOOGLE_CLIENT_ID`
- `AUTH_BROKER_GOOGLE_CLIENT_SECRET`
- `AUTH_BROKER_GOOGLE_HD`
- `AUTH_BROKER_GOOGLE_SCOPES`
- `AUTH_ALLOWED_EMAIL`
- `AUTH_ALLOWED_SUB`
- `AUTH_RESOLVE_FIREBASE_BY_EMAIL`
- `FIREBASE_PROJECT_ID`
- `LOG_LEVEL`
- `PORT`
- `MAX_RESULT_LIMIT`
- `REQUESTS_PER_MINUTE`

The server expects Application Default Credentials when running locally or on Cloud Run.

Mode-specific requirements:

- `AUTH_MODE=bearer`: requires `EXPENSES_OWNER_UID` and `MCP_BEARER_TOKEN`
- `AUTH_MODE=oauth`: requires `AUTH_ISSUER` and `AUTH_AUDIENCE`
- `AUTH_MODE=both`: requires `EXPENSES_OWNER_UID`, `MCP_BEARER_TOKEN`, `AUTH_ISSUER`, and `AUTH_AUDIENCE`

Embedded broker mode:

- `AUTH_BROKER_MODE=google`: enables an OAuth authorization server inside the same Cloud Run service
- requires a signing key for broker-issued JWTs (`AUTH_BROKER_JWT_PRIVATE_KEY`)
- requires upstream Google OAuth client credentials (`AUTH_BROKER_GOOGLE_CLIENT_ID`, `AUTH_BROKER_GOOGLE_CLIENT_SECRET`)
- optionally accepts bootstrap downstream clients via `AUTH_BROKER_BOOTSTRAP_CLIENTS`
- legacy shorthand for one bootstrap client is still supported via `AUTH_BROKER_CLIENT_ID`, `AUTH_BROKER_CLIENT_SECRET`, and `AUTH_BROKER_ALLOWED_REDIRECT_URIS`
- dynamic client registration is disabled by default; set `AUTH_BROKER_ENABLE_DCR=true` only when you explicitly need `/oauth/register`

Static bootstrap client settings are the safer default for clients that cannot dynamically register themselves.

`AUTH_ISSUER` is the JWT issuer to validate. `AUTH_AUTHORIZATION_SERVER` defaults to the issuer and is only needed when the login/discovery server differs from the token issuer. `AUTH_JWKS_URI` is optional and lets you bypass OIDC discovery when your provider does not expose a standard `openid-configuration` document.

For single-user owner restriction on top of per-user Firebase resolution, set either `AUTH_ALLOWED_EMAIL` or `AUTH_ALLOWED_SUB`.
For generic OIDC providers, prefer linking users by `issuer + sub` in Firestore. `AUTH_RESOLVE_FIREBASE_BY_EMAIL=true` enables a weaker fallback that only runs for verified email claims.

## Local run

Bearer only:

```bash
cd mcp-server
npm install
export EXPENSES_OWNER_UID="your-firebase-uid"
export AUTH_MODE="bearer"
export MCP_BEARER_TOKEN="replace-with-long-random-token"
export FIREBASE_PROJECT_ID="your-gcp-project"
npm run dev
```

OAuth + legacy bearer during migration:

```bash
cd mcp-server
npm install
export AUTH_MODE="both"
export MCP_BEARER_TOKEN="replace-with-long-random-token"
export AUTH_ISSUER="https://issuer.example.com/"
export AUTH_AUDIENCE="https://expenses-mcp.example.com/mcp"
export AUTH_AUTHORIZATION_SERVER="https://issuer.example.com/"
export AUTH_ALLOWED_EMAIL="owner@example.com"
export FIREBASE_PROJECT_ID="your-gcp-project"
npm run dev
```

Health check:

```bash
curl http://localhost:8080/healthz
```

Authenticated MCP endpoint:

```bash
curl \
  -H "Authorization: Bearer $MCP_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  http://localhost:8080/mcp
```

OAuth metadata discovery:

```bash
curl http://localhost:8080/.well-known/oauth-protected-resource/mcp
```

Unauthenticated OAuth challenge:

```bash
curl -i http://localhost:8080/mcp
```

In `oauth` or `both` mode the response includes a `401 Unauthorized` with:

```text
WWW-Authenticate: Bearer resource_metadata="http://localhost:8080/.well-known/oauth-protected-resource/mcp"
```

## Build

```bash
cd mcp-server
npm run build
```

## Docker

```bash
cd mcp-server
docker build -t expenses-mcp .
docker run \
  -p 8080:8080 \
  -e EXPENSES_OWNER_UID="your-firebase-uid" \
  -e AUTH_MODE="bearer" \
  -e MCP_BEARER_TOKEN="replace-with-long-random-token" \
  -e FIREBASE_PROJECT_ID="your-gcp-project" \
  expenses-mcp
```

## Cloud Run

## OIDC setup

For ChatGPT or Claude web connectors, you need a real OAuth/OIDC authorization server in addition to Cloud Run. The MCP server only acts as the protected resource.

Typical options:

- Google Cloud Identity Platform
- Auth0
- another OIDC provider that exposes discovery metadata or a JWKS URI

There is also an embedded Google broker mode for teams that want to keep everything in Cloud Run and authenticate users with Google accounts upstream.

Your provider must supply:

- issuer URL for token validation
- authorization server / discovery issuer for connector login
- client credentials for the connector UI
- callback URL support such as `https://claude.ai/api/mcp/auth_callback`

Use the token issuer as `AUTH_ISSUER` and the MCP URL as `AUTH_AUDIENCE`. When the provider's authorize/discovery host differs from the token issuer, set `AUTH_AUTHORIZATION_SERVER` as well. If the provider does not expose a standard OIDC discovery document, set `AUTH_JWKS_URI` explicitly.

## Embedded Google broker

This mode makes the same Cloud Run service act as both:

- the MCP protected resource at `/mcp`
- an OAuth authorization server for ChatGPT or Claude

Flow:

- ChatGPT starts OAuth at `/oauth/authorize`
- the broker sends the user to Google login
- Google redirects back to `/oauth/callback`
- the broker issues a short-lived authorization code to the downstream client
- the downstream client exchanges it at `/oauth/token`
- the broker returns a broker-signed access token JWT
- `/mcp` validates that JWT using its own OIDC discovery and JWKS endpoints

Required broker settings:

- `AUTH_MODE=oauth` or `both`
- `AUTH_BROKER_MODE=google`
- `AUTH_ISSUER` and `AUTH_AUTHORIZATION_SERVER` should be the public base URL of the Cloud Run service
- `AUTH_AUDIENCE` should be the exact `/mcp` URL you will enter in the connector UI
- `AUTH_BROKER_JWT_PRIVATE_KEY` is an RSA private key used to sign broker-issued JWTs
- `AUTH_BROKER_GOOGLE_CLIENT_ID` and `AUTH_BROKER_GOOGLE_CLIENT_SECRET` are the upstream Google OAuth client credentials

Optional bootstrap clients for non-DCR clients:

- `AUTH_BROKER_BOOTSTRAP_CLIENTS` accepts a JSON array of downstream OAuth clients
- each entry may define `clientId`, `clientSecret`, `redirectUris`, and `tokenEndpointAuthMethod`
- use one entry per AI agent when that agent does not support DCR, for example ChatGPT Chat, Claude Chat, or another hosted MCP client
- the legacy single-client env trio remains available as shorthand for one `client_secret_post` client

Google OAuth console requirements:

- create a Web application OAuth client
- add the Cloud Run callback URL `${AUTH_ISSUER%/}/oauth/callback` as an authorized redirect URI
- if you want to restrict sign-in to a workspace, set `AUTH_BROKER_GOOGLE_HD`

The embedded broker supports optional dynamic client registration plus bootstrap clients and validates PKCE with `S256`.

When Google broker mode is used, the MCP server resolves the authenticated Google account to a Firebase user by linked Google provider uid first and then by an optional `oauthIdentities` mapping. If no Firebase user matches, the MCP request is rejected.

Example bootstrap clients JSON:

```bash
export AUTH_BROKER_BOOTSTRAP_CLIENTS='[
  {
    "clientId": "chatgpt-chat",
    "clientSecret": "replace-with-chatgpt-secret",
    "redirectUris": ["https://replace-with-chatgpt-callback.example.com/oauth/callback"],
    "tokenEndpointAuthMethod": "client_secret_post"
  },
  {
    "clientId": "claude-chat",
    "clientSecret": "replace-with-claude-secret",
    "redirectUris": ["https://replace-with-claude-callback.example.com/oauth/callback"],
    "tokenEndpointAuthMethod": "client_secret_post"
  }
]'
```

Each `redirectUris` value must exactly match the callback URL documented by that AI agent. The broker validates exact matches only.

### Dynamic client registration

Set `AUTH_BROKER_ENABLE_DCR=true` before using `/oauth/register`.

The broker advertises OAuth Authorization Server Metadata and Dynamic Client Registration from:

- `/.well-known/oauth-authorization-server`
- `/.well-known/openid-configuration`
- `/oauth/register`

Minimal registration example:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  http://localhost:8080/oauth/register \
  -d '{
    "redirect_uris": ["https://client.example.com/oauth/callback"],
    "grant_types": ["authorization_code"],
    "response_types": ["code"],
    "token_endpoint_auth_method": "client_secret_basic",
    "client_name": "Example MCP Client"
  }'
```

The response includes a generated `client_id` and, unless `token_endpoint_auth_method` is `none`, a generated `client_secret`. Public clients may request the `refresh_token` grant and rely on PKCE plus refresh token rotation instead of a client secret.

Use DCR when the AI agent supports it. Use `AUTH_BROKER_BOOTSTRAP_CLIENTS` when the AI agent expects you to pre-provision a client id, client secret, and exact redirect URI.

### Secret Manager wiring

Create or rotate the bearer token secret:

```bash
export GCP_PROJECT_ID="your-gcp-project"
export MCP_BEARER_TOKEN_VALUE="replace-with-long-random-token"
npm run mcp:secret
```

You can also pass the token as a positional argument:

```bash
GCP_PROJECT_ID="your-gcp-project" \
  bash scripts/setup-mcp-secret.sh "replace-with-long-random-token"
```

### Deploy script

Example deploy via the repository script:

```bash
export GCP_PROJECT_ID="your-gcp-project"
export GCP_REGION="your-region"
export EXPENSES_OWNER_UID="your-firebase-uid"
export MCP_SERVICE_NAME="expenses-mcp"
export MCP_SERVICE_ACCOUNT="expenses-mcp@your-gcp-project.iam.gserviceaccount.com"
export AUTH_MODE="both"
export AUTH_ISSUER="https://issuer.example.com/"
export AUTH_AUDIENCE="https://expenses-mcp.example.com/mcp"
export AUTH_AUTHORIZATION_SERVER="https://issuer.example.com/"
export AUTH_BROKER_MODE="google"
export AUTH_BROKER_GOOGLE_CLIENT_ID="your-google-oauth-client-id.apps.googleusercontent.com"
export AUTH_ALLOWED_EMAIL="owner@example.com"
npm run mcp:deploy
```

The deploy script will:

- deploy Firestore composite indexes from `firestore.indexes.json` before Cloud Run rollout
- enable the required Cloud Run, Secret Manager, Cloud Build and Artifact Registry APIs
- deploy from the existing `mcp-server/` source directory
- inject non-secret config as environment variables
- wire `MCP_BEARER_TOKEN` from Secret Manager when `AUTH_MODE` is `bearer` or `both`
- wire broker secrets from Secret Manager when `AUTH_BROKER_MODE` is `google`
- wire `AUTH_BROKER_BOOTSTRAP_CLIENTS` from Secret Manager when you set `AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME`
- only wire `AUTH_BROKER_CLIENT_SECRET` when you explicitly use the legacy single bootstrap client envs

Set `DEPLOY_FIRESTORE_INDEXES=false` if you need to skip the index deployment step temporarily.
The index deployment step uses Firebase CLI authentication, so run `firebase login` first or provide a valid `FIREBASE_TOKEN` in the environment before invoking `npm run mcp:deploy`.

Raw `gcloud` equivalent:

```bash
gcloud run deploy expenses-mcp \
  --source mcp-server \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars EXPENSES_OWNER_UID=YOUR_UID,FIREBASE_PROJECT_ID=YOUR_PROJECT,AUTH_MODE=both,AUTH_ISSUER=https://ISSUER.EXAMPLE.COM/,AUTH_AUDIENCE=https://expenses-mcp.example.com/mcp,AUTH_AUTHORIZATION_SERVER=https://ISSUER.EXAMPLE.COM/,AUTH_ALLOWED_EMAIL=owner@example.com \
  --set-secrets MCP_BEARER_TOKEN=MCP_BEARER_TOKEN:latest
```

Grant the Cloud Run service account Firestore access for the target project. If you use a dedicated service account and keep legacy bearer auth enabled, also grant it Secret Manager access to read `MCP_BEARER_TOKEN`.

## Google-only note

If you want to stay inside Google Cloud, you now have two paths:

- pair the MCP server with an external OIDC issuer inside Google Cloud, such as Identity Platform
- or use the embedded Google broker mode in this service and let Google Accounts act as the upstream login provider

## Migration flow

- Deploy first with `AUTH_MODE=both`
- Verify Claude web connector can complete OAuth login
- Verify existing CLI clients still work with `MCP_BEARER_TOKEN`
- Move to `AUTH_MODE=oauth` only after confirming the OAuth path
