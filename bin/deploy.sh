#!/bin/bash

# Set colors
ESC_SEQ="\x1b["
COL_RESET=$ESC_SEQ"39;49;00m"
COL_RED=$ESC_SEQ"31;01m"
COL_GREEN=$ESC_SEQ"32;01m"

check_git_result () {
   if [[ $? -ne 0 ]]; then
      echo -en "${COL_RED}git failed!${COL_RESET}\n"
      popd
      exit 1
   fi
}

DEPLOY_DIR=build
DEPLOY_REMOTE=git@github.com:akvara/akvaratodo-deploy.git
APP_DIR=$(pwd)

# Execute build
echo -en "${COL_GREEN}Building...${COL_RESET}\n"
rm -r build/ > /dev/null
npm run build

# Check if build failed
if [[ $? -ne 0 ]]; then
   echo -en "${COL_RED}Build failed!${COL_RESET}\n"
   exit 1
fi

echo -en "${COL_GREEN}Adding deploy as remote in $DEPLOY_DIR ...${COL_RESET}\n"
cd build/
git init
git remote add deploy $DEPLOY_REMOTE
git add .
check_git_result
git ci -m "Build at $(date +"%y-%m-%d %T")"
check_git_result
git push -f deploy master
check_git_result

rm -rf build/
cd $APP_DIR

echo -e "${COL_GREEN}Deploy finished.${COL_RESET}"

exit 0
