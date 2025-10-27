#!/usr/bin/env bash
set -euo pipefail

# Sobe todo o stack local com rebuild garantindo dependências atualizadas.
docker compose -f infra/docker-compose.yml up --build "$@"
