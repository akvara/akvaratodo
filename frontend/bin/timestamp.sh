#!/usr/bin/env bash

timestamp=$(date +"%m%d-%H")
sed -i "s/version: '[0-9]\+-[0-9]\+/version: '$timestamp/" src/config/config.js
release="2"
versionstamp=$(date +"%m.%d")
sed -i "s/\"version\": \"[0-9].[0-9][0-9].[0-9][0-9]/\"version\": \"$release.$versionstamp/" ../package.json
sed -i "s/\"version\": \"[0-9].[0-9][0-9].[0-9][0-9]/\"version\": \"$release.$versionstamp/" ./package.json
