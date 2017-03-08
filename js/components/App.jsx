var CONFIG = {
    // listsapi: 'http://localhost:3000/',
    listsapi: 'http://akvaratododb.herokuapp.com/',
    cookieTodo: 'backup-data-todo',
    postponeBy: 10,
    addNewAt: 6,
    maxTaskLength: 43,
    displayListLength: 11,
    displayLast: 3,
    version: 170307
};

React.render(<ListApp config={CONFIG}/>, document.getElementById("app"));
