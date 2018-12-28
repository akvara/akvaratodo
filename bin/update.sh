cd frontend
echo "Updating in $PWD..."
npm update
cd ../backend
echo "Updating in $PWD ..."
npm update
cd ..
echo "Update finished. Now run ./bin/develop.sh"
