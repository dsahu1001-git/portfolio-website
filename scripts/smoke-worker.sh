#!/usr/bin/env bash
set -euo pipefail

base_url="${1:?Usage: smoke-worker.sh <base-url>}"

curl --fail --silent --show-error "${base_url}/" >/dev/null
curl --fail --silent --show-error "${base_url}/blog/platform-in-a-box" >/dev/null
curl --fail --silent --show-error "${base_url}/newsletter" >/dev/null

puzzle="$(curl --fail --silent --show-error "${base_url}/api/game/puzzle")"
echo "$puzzle" | jq -e '
  .game == "connections-india" and
  .status == "available" and
  (.groups | length == 4)
' >/dev/null

score="$(curl --fail --silent --show-error \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"game":"connections-india","playerName":"Deployment smoke test","score":4}' \
  "${base_url}/api/game/score")"
echo "$score" | jq -e '.success == true and .saved == true' >/dev/null

status="$(curl --silent --output /dev/null --write-out '%{http_code}' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"email":"not-an-email","topics":["ai"]}' \
  "${base_url}/api/newsletter")"
test "$status" = "400"

echo "Worker smoke checks passed for ${base_url}"
