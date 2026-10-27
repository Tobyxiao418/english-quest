#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm test
# Review staged files before every publish. Never add recordings or secrets.
git diff --check
git push origin main
printf '\nPush complete. Check GitHub Pages build and verify the live URL before claiming a release.\n'
