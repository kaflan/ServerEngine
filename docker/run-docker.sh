#!/bin/bash
# wait-for-postgres.sh

set -e

host="$1"
shift

sequelize db:migrate
node ./server/dist/boot.js
