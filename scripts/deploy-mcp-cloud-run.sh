#!/usr/bin/env bash

set -euo pipefail

if ! command -v gcloud >/dev/null 2>&1; then
  echo "gcloud is required" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MCP_DIR="$ROOT_DIR/mcp-server"

SERVICE_NAME="${MCP_SERVICE_NAME:-expenses-mcp}"
PROJECT_ID="${GCP_PROJECT_ID:-${GOOGLE_CLOUD_PROJECT:-}}"
REGION="${GCP_REGION:-}"
OWNER_UID="${EXPENSES_OWNER_UID:-}"
FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID:-$PROJECT_ID}"
SECRET_NAME="${MCP_BEARER_TOKEN_SECRET_NAME:-MCP_BEARER_TOKEN}"
LOG_LEVEL="${LOG_LEVEL:-info}"
MIN_INSTANCES="${MCP_MIN_INSTANCES:-0}"
MAX_INSTANCES="${MCP_MAX_INSTANCES:-3}"
CONCURRENCY="${MCP_CONCURRENCY:-20}"
MAX_RESULT_LIMIT="${MAX_RESULT_LIMIT:-200}"
REQUESTS_PER_MINUTE="${REQUESTS_PER_MINUTE:-180}"
SERVICE_ACCOUNT="${MCP_SERVICE_ACCOUNT:-}"

if [[ -z "$PROJECT_ID" ]]; then
  echo "Set GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT" >&2
  exit 1
fi

if [[ -z "$REGION" ]]; then
  echo "Set GCP_REGION" >&2
  exit 1
fi

if [[ -z "$OWNER_UID" ]]; then
  echo "Set EXPENSES_OWNER_UID" >&2
  exit 1
fi

if [[ ! -d "$MCP_DIR" ]]; then
  echo "Cannot find mcp-server directory at $MCP_DIR" >&2
  exit 1
fi

gcloud config set project "$PROJECT_ID" >/dev/null

gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project "$PROJECT_ID" >/dev/null

env_vars="EXPENSES_OWNER_UID=$OWNER_UID,FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID,LOG_LEVEL=$LOG_LEVEL,MAX_RESULT_LIMIT=$MAX_RESULT_LIMIT,REQUESTS_PER_MINUTE=$REQUESTS_PER_MINUTE"

deploy_args=(
  run deploy "$SERVICE_NAME"
  --source "$MCP_DIR"
  --project "$PROJECT_ID"
  --region "$REGION"
  --allow-unauthenticated
  --port 8080
  --min-instances "$MIN_INSTANCES"
  --max-instances "$MAX_INSTANCES"
  --concurrency "$CONCURRENCY"
  --set-env-vars "$env_vars"
  --set-secrets "MCP_BEARER_TOKEN=$SECRET_NAME:latest"
)

if [[ -n "$SERVICE_ACCOUNT" ]]; then
  deploy_args+=(--service-account "$SERVICE_ACCOUNT")
fi

gcloud "${deploy_args[@]}"

echo
echo "Deployment finished."
echo "Describe service: gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID"
