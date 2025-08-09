#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-.}"
F="$ROOT/backend/server.js"

if [ ! -f "$F" ]; then
  echo "server.js not found at $F"
  exit 1
fi

cp "$F" "$F.bak.$(date +%Y%m%d%H%M%S)"

# 1) Fix object spread typos like `{ .req.body, ... }` -> `{ ...req.body, ... }`
perl -0777 -pe "s/\{\s*\.\s*req\s*\.\s*body\s*,\s*/{ ...req.body, /g" -i "$F"

# 2) Fix `.allocation.toObject()` inside object literals -> `...allocation.toObject()`
perl -0777 -pe "s/\{\s*\.\s*allocation\s*\.\s*toObject\(\)\s*,\s*/{ ...allocation.toObject(), /g" -i "$F"

# 3) Fix `{ .wbs, lastModified` -> `{ ...wbs, lastModified`
perl -0777 -pe "s/\{\s*\.\s*wbs\s*,\s*lastModified/{ ...wbs, lastModified/g" -i "$F"

echo "✅ Patched $F"
