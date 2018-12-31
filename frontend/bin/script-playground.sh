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

echo "Build at $(date +"%y-%m-%d %T")"

