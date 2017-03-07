var CONFIG = {
    // listsapi: 'http://akvaratodoapi.link:3000/',
    listsapi: 'http://akvaratododb.herokuapp.com/',
    cookieTodo: 'backup-data-todo',
    postponeBy: 15,
    addNewAt: 7,
    maxTaskLength: 45,
    displayFirst: 10,
    displayLast: 4,
};

React.render(<ListApp config={CONFIG}/>, document.getElementById("app"));
