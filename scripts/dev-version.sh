#/bin/sh

set -euo pipefail
DEV=$(jq -r ".version" package.json | awk -F "-" '{print $1}')-dev.$(git rev-parse --short HEAD)
cat <<< "$(jq --arg DEV "$DEV" ".version = \"$DEV\"" package.json)" > package.json
