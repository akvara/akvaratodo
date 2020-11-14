#!/usr/bin/env bash

timestamp=$(date +"%m%d-%H")
sed -i.bak -e "s/version: '[0-9][0-9][0-9][0-9]-[0-9][0-9]/version: '$timestamp/" ./src/config/config.js
rm ./src/config/config.js.bak
release="2"
versionstamp=$(date +"%m.%d")
sed -i.bak -e  "s/\"version\": \"[0-9].[0-9][0-9].[0-9][0-9]/\"version\": \"$release.$versionstamp/" ./package.json
rm ./package.json.bak
