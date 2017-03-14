var CONFIG = require('../config.js');

var getListsUrl = function() {
    return CONFIG.default.apiHost + CONFIG.default.user.id + "/" + CONFIG.default.listsAddon;
};

var getAListUrl = function(listId) {
    return getListsUrl() + "/" + listId;
};

module.exports = {
	getListsUrl,
	getAListUrl
};
