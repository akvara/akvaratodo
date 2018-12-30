#!/bin/bash

deploy_dir=build
deploy_remote=git@github.com:akvara/oldakvaratodo-deploy.git
app_dir=$(pwd)

echo Building
rm -r build/
npm run build
echo Adding deploy as remote in $deploy_dir ...
cd build/
git remote add deploy $deploy_remote
echo Initializing git ...
git init
echo Adding deploy as remote ...
git remote add deploy $deploy_remote
git add .
git ci -m "Build"
git push -f deploy master
cd $app_dir
rm -rf build/
