#!/usr/bin/env bash
timestamp=$(date +"%m%d-%H")
sed -i '' "s/version: '[0-1][0-9][0-9][0-9]-[0-2][0-9]'/version: '$timestamp'/" ./frontend/src/config.js
release=2
versionstamp=$(date +"%m.%d")
sed -i '' "s/\"version\": \"[0-9].[0-1][0-9].[0-3][0-9]\",/\"version\": \"$release.$versionstamp\",/" ./frontend/package.json
