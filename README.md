# akvaratodo
ToDo App - React.js

Migrations:
* create:  ./node_modules/.bin/mm create {migration-name} --config=migrations/config/mm-config-{local}.json
* migrate: ./node_modules/.bin/mm --config=migrations/config/mm-config-{local}.json


Tests:
* Should load Lists if OpenIfExists is not set
* Should open OpenIfExists
* Load lists
* Add a list
* Delete a list
* Load a list
* Add item, save




* TaskApp workfow:
** after each user action on list:
** 1) checkWrapper(dataToSave, callback) // dataToSave == this.state analogas/kopija
** 2) callbackForSettingState.bind(this, highlightPosition)

