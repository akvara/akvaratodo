var CONFIG = require('../config.js');

var getBaseUrl = function() {
    return CONFIG.default.apiHost + CONFIG.default.user.id + "/";
};

var getListsUrl = function() {
    return getBaseUrl() + CONFIG.default.listsAddon;
};

var getAListUrl = function(listId) {
    return getListsUrl() + "/" + listId;
};

var getUserSettingsUrl = function() {
    return getBaseUrl() + CONFIG.default.settingsAddon;
};

module.exports = {
	getListsUrl,
	getAListUrl,
    getUserSettingsUrl
};
