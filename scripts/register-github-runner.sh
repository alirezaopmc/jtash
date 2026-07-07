#!/usr/bin/env bash
# Register and start the jtash GitHub Actions self-hosted runner on this machine.
# Requires a one-time registration token from GitHub or `gh auth login`.
set -euo pipefail

REPO="alirezaopmc/jtash"
RUNNER_DIR="${RUNNER_DIR:-/home/opmc/actions-runners/jtash}"
RUNNER_NAME="${RUNNER_NAME:-manova-dev}"
RUNNER_LABELS="${RUNNER_LABELS:-self-hosted,Linux,manova}"

cd "$RUNNER_DIR"

if [ ! -f ./config.sh ]; then
  echo "Runner not downloaded. Run: mkdir -p $RUNNER_DIR && cd $RUNNER_DIR && curl -fsSL -o runner.tgz -L https://github.com/actions/runner/releases/latest/download/actions-runner-linux-x64.tar.gz && tar xzf runner.tgz"
  exit 1
fi

if [ -f .runner ]; then
  echo "Runner already configured in $RUNNER_DIR"
else
  TOKEN="${RUNNER_TOKEN:-}"
  if [ -z "$TOKEN" ] && command -v gh >/dev/null 2>&1; then
    TOKEN="$(gh api -X POST "repos/${REPO}/actions/runners/registration-token" --jq .token 2>/dev/null || true)"
  fi
  if [ -z "$TOKEN" ]; then
    echo "Set RUNNER_TOKEN (from GitHub → Settings → Actions → Runners → New self-hosted runner)"
    echo "or run: gh auth login && re-run this script"
    exit 1
  fi
  ./config.sh \
    --url "https://github.com/${REPO}" \
    --token "$TOKEN" \
    --name "$RUNNER_NAME" \
    --labels "$RUNNER_LABELS" \
    --unattended \
    --replace
fi

./svc.sh install
./svc.sh start
./svc.sh status
echo "Runner ready for ${REPO}"
