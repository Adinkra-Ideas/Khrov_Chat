#!/bin/sh
set -e

npx prisma migrate dev --name init

exec "$@"