var CONFIG = {
    // listsapi: 'http://localhost:3000/',
    listsapi: 'http://akvaratododb.herokuapp.com/',
    cookieTodo: 'backup-data-todo',
    postponeBy: 10,
    addNewAt: 6,
    maxTaskLength: 50,
    displayListLength: 17,
    displayLast: 3,
    version: 170311
};

React.render(<ListApp config={CONFIG}/>, document.getElementById("app"));
