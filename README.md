# akvaratodo

ToDo App - React + Redux + TS

# Backend
## Migrations:
* create:  ./node_modules/.bin/mm create {migration-name} --config=migrations/config/mm-config-{local}.json
* migrate: ./node_modules/.bin/mm --config=migrations/config/mm-config-{local}.json

## Develop
Git hooks:
```bash
cd .git/hooks/ && ln -s ../../.githooks/pre-push . && cd ../..
```

Initialize (npm install, etc)
```bash
./bin/init.sh
```
Start with development DB:
```bash
./bin/develop.sh
```
Start with production DB:
```bash
./bin/production.sh
```

## Deploy
Hosting on netlify.com
```bash
cd frontend
./bin/deploy.sh
```
Deploy on oldakvaratodo
```sh
./bin/old-deploy.sh
```

# ToDo
- MovePage: data types
- MovePage: filter list
## Test
Manual test:
### Lists page
- Reload Lists
- Plan week
- Create list
- Create list with existing name
- Today
- Collect to Today
### Lists page
