#!/usr/bin/env bash
echo "1. Installing in $PWD..."
npm install
cd frontend
echo "2. Installing in $PWD..."
npm install
cd ../backend
echo "3. Installing in $PWD ..."
npm install
cd ..
echo "Install finished. Now run ./bin/develop.sh"