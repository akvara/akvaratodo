import { ApiManager } from './apiManager';
import CONFIG from '../../config/config';

const host = process.env.NODE_ENV === 'development' ? CONFIG.devHost : CONFIG.apiHost;
const userId = CONFIG.user.id;

export default ApiManager({
  HTTPBaseURL: `${host}${userId}/`,
});
