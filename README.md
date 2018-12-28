# akvaratodo
ToDo App - React + Redux

## Backend
### Migrations:
* create:  ./node_modules/.bin/mm create {migration-name} --config=migrations/config/mm-config-{local}.json
* migrate: ./node_modules/.bin/mm --config=migrations/config/mm-config-{local}.json

## Developer
Git hooks:

```sh
cd .git/hooks/ && ln -s ../../.githooks/pre-push . && cd ../..
```

Initialize (npm install, etc)
```sh
./bin/init.sh
```
Start in dev env:
```sh
./bin/both
```
or 
```sh
./bin/develop.sh
```
