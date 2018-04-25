let CONFIG = require('../config.js');

let getHostUrl = function () {
    return process.env.NODE_ENV === 'development' ? CONFIG.default.devHost : CONFIG.default.apiHost;
};

let getBaseUrl = function () {
    return getHostUrl() + CONFIG.default.user.id + "/";
};

let getListsUrl = function () {
    return getBaseUrl() + CONFIG.default.listsAddon;
};

let getAListUrl = function (listId) {
    return getListsUrl() + "/" + listId;
};

let getUserSettingsUrl = function () {
    return getBaseUrl() + CONFIG.default.settingsAddon;
};

module.exports = {
    getListsUrl,
    getAListUrl,
    getUserSettingsUrl
};
