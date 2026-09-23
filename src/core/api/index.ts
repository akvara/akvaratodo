import { ApiManager } from './apiManager';
import CONFIG from '../../config/config.js';

const host = import.meta.env.DEV ? CONFIG.devHost : CONFIG.apiHost;
const userId = CONFIG.user.id;

export default ApiManager({
  HTTPBaseURL: `${host}${userId}/`,
});
