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
Start with development DB:
```sh
./bin/develop.sh
```
Start with production DB:
```sh
./bin/production.sh
```
