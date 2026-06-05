#!/usr/bin/env bash

set -euo pipefail

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud is required" >&2
  exit 1
fi

PROJECT_ID="${GCP_PROJECT_ID:-${GOOGLE_CLOUD_PROJECT:-}}"
SECRET_NAME="${MCP_BEARER_TOKEN_SECRET_NAME:-MCP_BEARER_TOKEN}"
SECRET_VALUE="${MCP_BEARER_TOKEN_VALUE:-${1:-}}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Set GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT" >&2
  exit 1
fi

if [[ -z "$SECRET_VALUE" ]]; then
  echo "Pass the bearer token as the first argument or set MCP_BEARER_TOKEN_VALUE" >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID" >/dev/null
gcloud services enable secretmanager.googleapis.com --project "$PROJECT_ID" >/dev/null

if ! gcloud secrets describe "$SECRET_NAME" --project "$PROJECT_ID" >/dev/null 2>&1; then
  gcloud secrets create "$SECRET_NAME" \
    --replication-policy="automatic" \
    --project "$PROJECT_ID" >/dev/null
fi

printf '%s' "$SECRET_VALUE" | gcloud secrets versions add "$SECRET_NAME" \
  --data-file=- \
  --project "$PROJECT_ID" >/dev/null

echo "Secret $SECRET_NAME updated in project $PROJECT_ID"
