#!/bin/sh
set -eu
mkdir -p /app/data
npx prisma db push --schema prisma/schema.prisma --skip-generate
node server.js
