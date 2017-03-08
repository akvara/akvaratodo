// 'use strict';

var config = { 
    listsapi: 'http://localhost:5000/',
    // listsapi: 'http://akvaratododb.herokuapp.com/',
    cookieTodo: 'backup-data-todo',
    postponeBy: 10,
    addNewAt: 6,
    maxTaskLength: 43,
    displayListLength: 15,
    displayLast: 3,
    version: 170308
};

export default Object.freeze(config);
// module.exports = config;