#!/bin/bash

set -euo pipefail

DB_PASSWORD=$(cat /run/secrets/db_password)
DB_USER=${DB_USER:-}
DB_NAME=${DB_NAME:-}

echo "DB_USER: $DB_USER"
echo "DB_NAME: $DB_NAME"

#export $(grep -v '^#' .env | xargs)
echo "export DATABASE_URL=postgres://$DB_USER:$DB_PASSWORD@db:5432/$DB_NAME?schema=public" >> ~/.bashrc
source ~/.bashrc
#export $DATABASE_URL="postgres://$DB_USER:$DB_PASSWORD@db:5432/$DB_NAME?schema=public"

if [[ -d "/app/prisma" ]]; then
   rm -rf /app/prisma
fi

pnpm prisma init
pnpm prisma db pull
pnpm prisma generate



