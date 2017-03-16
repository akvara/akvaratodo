var CONFIG = require('../config.js');

var getHostUrl = function() {
    return process.env.NODE_ENV === 'development' ? CONFIG.default.devHost : CONFIG.default.apiHost;
};

var getBaseUrl = function() {
    return getHostUrl() + CONFIG.default.user.id + "/";
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
