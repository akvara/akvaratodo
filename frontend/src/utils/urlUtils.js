import CONFIG from '../config.js';

export const getHostUrl = () =>
  process.env.NODE_ENV === 'development' ? CONFIG.devHost : CONFIG.apiHost;

export const getBaseUrl = () => getHostUrl() + CONFIG.user.id + '/';

export const getListsUrl = () => getBaseUrl() + CONFIG.listsAddon;

export const getAListUrl = (listId) => getListsUrl() + '/' + listId;

// export const getUserSettingsUrl = () => {
//   return getBaseUrl() + CONFIG.default.settingsAddon;
// };
//
