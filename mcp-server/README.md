# Expenses MCP Server

Standalone MCP runtime for the Expenses app. It exposes Firestore-backed tools over a hosted HTTP endpoint so ChatGPT or Claude can connect without depending on the Angular UI or browser auth.

## What it serves

- `list_expenses`
- `search_expenses`
- `get_expense`
- `monthly_summary`
- `export_expenses`
- `create_expense`
- `update_expense`

All queries are hard-scoped to one Firebase uid via `EXPENSES_OWNER_UID`.

## Environment

Required:

- `EXPENSES_OWNER_UID`
- `MCP_BEARER_TOKEN`

Optional:

- `FIREBASE_PROJECT_ID`
- `LOG_LEVEL`
- `PORT`
- `MAX_RESULT_LIMIT`
- `REQUESTS_PER_MINUTE`

The server expects Application Default Credentials when running locally or on Cloud Run.

## Local run

```bash
cd mcp-server
npm install
export EXPENSES_OWNER_UID="your-firebase-uid"
export MCP_BEARER_TOKEN="replace-with-long-random-token"
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
  -e MCP_BEARER_TOKEN="replace-with-long-random-token" \
  -e FIREBASE_PROJECT_ID="your-gcp-project" \
  expenses-mcp
```

## Cloud Run

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
npm run mcp:deploy
```

The deploy script will:

- enable the required Cloud Run, Secret Manager, Cloud Build and Artifact Registry APIs
- deploy from the existing `mcp-server/` source directory
- inject non-secret config as environment variables
- wire `MCP_BEARER_TOKEN` from Secret Manager using the latest version

Raw `gcloud` equivalent:

```bash
gcloud run deploy expenses-mcp \
  --source mcp-server \
  --region YOUR_REGION \
  --allow-unauthenticated \
  --set-env-vars EXPENSES_OWNER_UID=YOUR_UID,FIREBASE_PROJECT_ID=YOUR_PROJECT \
  --set-secrets MCP_BEARER_TOKEN=MCP_BEARER_TOKEN:latest
```

Grant the Cloud Run service account Firestore access for the target project. If you use a dedicated service account, also grant it Secret Manager access to read `MCP_BEARER_TOKEN`.