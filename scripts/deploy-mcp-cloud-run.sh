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
DEPLOY_FIRESTORE_INDEXES="${DEPLOY_FIRESTORE_INDEXES:-true}"
SECRET_NAME="${MCP_BEARER_TOKEN_SECRET_NAME:-MCP_BEARER_TOKEN}"
AUTH_MODE="${AUTH_MODE:-bearer}"
AUTH_BROKER_MODE="${AUTH_BROKER_MODE:-disabled}"
AUTH_ISSUER="${AUTH_ISSUER:-}"
AUTH_AUDIENCE="${AUTH_AUDIENCE:-}"
AUTH_AUTHORIZATION_SERVER="${AUTH_AUTHORIZATION_SERVER:-}"
AUTH_JWKS_URI="${AUTH_JWKS_URI:-}"
AUTH_BROKER_CLIENT_ID="${AUTH_BROKER_CLIENT_ID:-}"
AUTH_BROKER_CLIENT_SECRET="${AUTH_BROKER_CLIENT_SECRET:-}"
AUTH_BROKER_ALLOWED_REDIRECT_URIS="${AUTH_BROKER_ALLOWED_REDIRECT_URIS:-}"
AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES="${AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES:-}"
AUTH_BROKER_BOOTSTRAP_CLIENTS="${AUTH_BROKER_BOOTSTRAP_CLIENTS:-}"
AUTH_BROKER_ENABLE_DCR="${AUTH_BROKER_ENABLE_DCR:-false}"
AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME="${AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME:-}"
AUTH_BROKER_CLIENT_SECRET_SECRET_NAME="${AUTH_BROKER_CLIENT_SECRET_SECRET_NAME:-AUTH_BROKER_CLIENT_SECRET}"
AUTH_BROKER_JWT_PRIVATE_KEY_SECRET_NAME="${AUTH_BROKER_JWT_PRIVATE_KEY_SECRET_NAME:-AUTH_BROKER_JWT_PRIVATE_KEY}"
AUTH_BROKER_JWT_KEY_ID="${AUTH_BROKER_JWT_KEY_ID:-mcp-broker-key-1}"
AUTH_BROKER_GOOGLE_CLIENT_ID="${AUTH_BROKER_GOOGLE_CLIENT_ID:-}"
AUTH_BROKER_GOOGLE_CLIENT_SECRET_SECRET_NAME="${AUTH_BROKER_GOOGLE_CLIENT_SECRET_SECRET_NAME:-AUTH_BROKER_GOOGLE_CLIENT_SECRET}"
AUTH_BROKER_GOOGLE_HD="${AUTH_BROKER_GOOGLE_HD:-}"
AUTH_BROKER_GOOGLE_SCOPES="${AUTH_BROKER_GOOGLE_SCOPES:-openid email profile}"
AUTH_ALLOWED_EMAIL="${AUTH_ALLOWED_EMAIL:-}"
AUTH_ALLOWED_SUB="${AUTH_ALLOWED_SUB:-}"
AUTH_RESOLVE_FIREBASE_BY_EMAIL="${AUTH_RESOLVE_FIREBASE_BY_EMAIL:-false}"
LOG_LEVEL="${LOG_LEVEL:-info}"
MIN_INSTANCES="${MCP_MIN_INSTANCES:-0}"
MAX_INSTANCES="${MCP_MAX_INSTANCES:-3}"
CONCURRENCY="${MCP_CONCURRENCY:-20}"
MAX_RESULT_LIMIT="${MAX_RESULT_LIMIT:-200}"
REQUESTS_PER_MINUTE="${REQUESTS_PER_MINUTE:-180}"
SERVICE_ACCOUNT="${MCP_SERVICE_ACCOUNT:-}"

case "$AUTH_MODE" in
  bearer|oauth|both)
    ;;
  *)
    echo "AUTH_MODE must be one of: bearer, oauth, both" >&2
    exit 1
    ;;
esac

case "$AUTH_BROKER_MODE" in
  disabled|google)
    ;;
  *)
    echo "AUTH_BROKER_MODE must be one of: disabled, google" >&2
    exit 1
    ;;
esac

if [[ -z "$PROJECT_ID" ]]; then
  echo "Set GCP_PROJECT_ID or GOOGLE_CLOUD_PROJECT" >&2
  exit 1
fi

if [[ -z "$REGION" ]]; then
  echo "Set GCP_REGION" >&2
  exit 1
fi

if [[ "$AUTH_MODE" == "bearer" || "$AUTH_MODE" == "both" ]]; then
  if [[ -z "$OWNER_UID" ]]; then
    echo "Set EXPENSES_OWNER_UID when AUTH_MODE is bearer or both" >&2
    exit 1
  fi
fi

if [[ "$AUTH_MODE" == "oauth" || "$AUTH_MODE" == "both" ]]; then
  if [[ -z "$AUTH_ISSUER" ]]; then
    echo "Set AUTH_ISSUER when AUTH_MODE is oauth or both" >&2
    exit 1
  fi

  if [[ -z "$AUTH_AUDIENCE" ]]; then
    echo "Set AUTH_AUDIENCE when AUTH_MODE is oauth or both" >&2
    exit 1
  fi
fi

if [[ "$AUTH_BROKER_MODE" == "google" ]]; then
  for required_name in \
    AUTH_BROKER_GOOGLE_CLIENT_ID
  do
    if [[ -z "${!required_name:-}" ]]; then
      echo "Set $required_name when AUTH_BROKER_MODE is google" >&2
      exit 1
    fi
  done

  if [[ ! "$AUTH_BROKER_GOOGLE_CLIENT_ID" =~ ^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$ ]]; then
    echo "AUTH_BROKER_GOOGLE_CLIENT_ID must be a real Google OAuth client ID, not a placeholder value" >&2
    exit 1
  fi
fi

has_bootstrap_client="false"
if [[ -n "$AUTH_BROKER_CLIENT_ID" || -n "$AUTH_BROKER_ALLOWED_REDIRECT_URIS" || -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS" || -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME" ]]; then
  has_bootstrap_client="true"
fi

if [[ "$has_bootstrap_client" == "true" ]]; then
  if [[ -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS" && -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME" ]]; then
    echo "Set either AUTH_BROKER_BOOTSTRAP_CLIENTS or AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME, not both" >&2
    exit 1
  fi

  if [[ (-n "$AUTH_BROKER_CLIENT_ID" || -n "$AUTH_BROKER_ALLOWED_REDIRECT_URIS") && (-z "$AUTH_BROKER_CLIENT_ID" || -z "$AUTH_BROKER_ALLOWED_REDIRECT_URIS") ]]; then
    echo "Set AUTH_BROKER_CLIENT_ID and AUTH_BROKER_ALLOWED_REDIRECT_URIS together when using a bootstrap OAuth client" >&2
    exit 1
  fi
fi

if [[ ! -d "$MCP_DIR" ]]; then
  echo "Cannot find mcp-server directory at $MCP_DIR" >&2
  exit 1
fi

if [[ "$DEPLOY_FIRESTORE_INDEXES" == "true" ]]; then
  echo "Deploying Firestore indexes..."
  (
    cd "$ROOT_DIR"
    npx --yes firebase-tools deploy --only firestore:indexes --project "$FIREBASE_PROJECT_ID"
  )
fi

gcloud config set project "$PROJECT_ID" >/dev/null

gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  --project "$PROJECT_ID" >/dev/null

env_vars=(
  "FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID"
  "AUTH_MODE=$AUTH_MODE"
  "AUTH_BROKER_MODE=$AUTH_BROKER_MODE"
  "AUTH_BROKER_ENABLE_DCR=$AUTH_BROKER_ENABLE_DCR"
  "LOG_LEVEL=$LOG_LEVEL"
  "MAX_RESULT_LIMIT=$MAX_RESULT_LIMIT"
  "REQUESTS_PER_MINUTE=$REQUESTS_PER_MINUTE"
  "AUTH_RESOLVE_FIREBASE_BY_EMAIL=$AUTH_RESOLVE_FIREBASE_BY_EMAIL"
)

if [[ -n "$OWNER_UID" ]]; then
  env_vars+=("EXPENSES_OWNER_UID=$OWNER_UID")
fi

if [[ -n "$AUTH_ISSUER" ]]; then
  env_vars+=("AUTH_ISSUER=$AUTH_ISSUER")
fi

if [[ -n "$AUTH_AUDIENCE" ]]; then
  env_vars+=("AUTH_AUDIENCE=$AUTH_AUDIENCE")
fi

if [[ -n "$AUTH_AUTHORIZATION_SERVER" ]]; then
  env_vars+=("AUTH_AUTHORIZATION_SERVER=$AUTH_AUTHORIZATION_SERVER")
fi

if [[ -n "$AUTH_JWKS_URI" ]]; then
  env_vars+=("AUTH_JWKS_URI=$AUTH_JWKS_URI")
fi

if [[ -n "$AUTH_BROKER_CLIENT_ID" ]]; then
  env_vars+=("AUTH_BROKER_CLIENT_ID=$AUTH_BROKER_CLIENT_ID")
fi

if [[ -n "$AUTH_BROKER_ALLOWED_REDIRECT_URIS" ]]; then
  env_vars+=("AUTH_BROKER_ALLOWED_REDIRECT_URIS=$AUTH_BROKER_ALLOWED_REDIRECT_URIS")
fi

if [[ -n "$AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES" ]]; then
  env_vars+=("AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES=$AUTH_BROKER_ALLOWED_REDIRECT_SCHEMES")
fi

if [[ -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS" ]]; then
  env_vars+=("AUTH_BROKER_BOOTSTRAP_CLIENTS=$AUTH_BROKER_BOOTSTRAP_CLIENTS")
fi

if [[ -n "$AUTH_BROKER_JWT_KEY_ID" ]]; then
  env_vars+=("AUTH_BROKER_JWT_KEY_ID=$AUTH_BROKER_JWT_KEY_ID")
fi

if [[ -n "$AUTH_BROKER_GOOGLE_CLIENT_ID" ]]; then
  env_vars+=("AUTH_BROKER_GOOGLE_CLIENT_ID=$AUTH_BROKER_GOOGLE_CLIENT_ID")
fi

if [[ -n "$AUTH_BROKER_GOOGLE_HD" ]]; then
  env_vars+=("AUTH_BROKER_GOOGLE_HD=$AUTH_BROKER_GOOGLE_HD")
fi

if [[ -n "$AUTH_BROKER_GOOGLE_SCOPES" ]]; then
  env_vars+=("AUTH_BROKER_GOOGLE_SCOPES=$AUTH_BROKER_GOOGLE_SCOPES")
fi

if [[ -n "$AUTH_ALLOWED_EMAIL" ]]; then
  env_vars+=("AUTH_ALLOWED_EMAIL=$AUTH_ALLOWED_EMAIL")
fi

if [[ -n "$AUTH_ALLOWED_SUB" ]]; then
  env_vars+=("AUTH_ALLOWED_SUB=$AUTH_ALLOWED_SUB")
fi

env_vars_csv=$(IFS=, ; echo "${env_vars[*]}")

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
  --set-env-vars "$env_vars_csv"
)

if [[ "$AUTH_MODE" == "bearer" || "$AUTH_MODE" == "both" ]]; then
  deploy_args+=(--set-secrets "MCP_BEARER_TOKEN=$SECRET_NAME:latest")
fi

if [[ "$AUTH_BROKER_MODE" == "google" ]]; then
  deploy_args+=(
    --set-secrets "AUTH_BROKER_GOOGLE_CLIENT_SECRET=$AUTH_BROKER_GOOGLE_CLIENT_SECRET_SECRET_NAME:latest"
    --set-secrets "AUTH_BROKER_JWT_PRIVATE_KEY=$AUTH_BROKER_JWT_PRIVATE_KEY_SECRET_NAME:latest"
  )

  if [[ "$has_bootstrap_client" == "true" ]]; then
    if [[ -n "$AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME" ]]; then
      deploy_args+=(
        --set-secrets "AUTH_BROKER_BOOTSTRAP_CLIENTS=$AUTH_BROKER_BOOTSTRAP_CLIENTS_SECRET_NAME:latest"
      )
    fi

    if [[ -n "$AUTH_BROKER_CLIENT_ID" ]]; then
      deploy_args+=(
        --set-secrets "AUTH_BROKER_CLIENT_SECRET=$AUTH_BROKER_CLIENT_SECRET_SECRET_NAME:latest"
      )
    fi
  fi
fi

if [[ -n "$SERVICE_ACCOUNT" ]]; then
  deploy_args+=(--service-account "$SERVICE_ACCOUNT")
fi

gcloud "${deploy_args[@]}"

echo
echo "Deployment finished."
echo "Describe service: gcloud run services describe $SERVICE_NAME --region $REGION --project $PROJECT_ID"
