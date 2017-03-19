# akvaratodo
ToDo App - React.js

Working:
LoadingDecorator => ListApp =>!TaskApp

Test functionality:
* Load lists
* Add a list
* Delete a list
* Load a list
* Add item, save

Migrations:
* create:  ./node_modules/.bin/mm create {migration-name} --config=migrations/config/mm-config-{local}.json
* migrate: ./node_modules/.bin/mm --config=migrations/config/mm-config-{local}.json

index.js -> App:loadData ->App:loadUserSettings ->App:setUserSettings -> -> -> ->





* TaskApp workfow:
** after each user action on list:
** 1) checkWrapper(dataToSave, callback) // dataToSave == this.state analogas/kopija
** 2) callbackForSettingState.bind(this, highlightPosition)

