import ListsServiceFactory from './lists/lists.api';
import { generateConf } from '../axios';

// export interface APIManagerConfig {
//   userId?: string;
// }

// const config: APIManagerConfig = {};

type apiManagerParams = {
  HTTPBaseURL: string;
};

export const ApiManager = (params: apiManagerParams) => {
  const { HTTPBaseURL } = params;
  const HTTP = generateConf({ baseURL: HTTPBaseURL });
  return {
    lists: ListsServiceFactory({ HTTPBase: HTTP }),
  };
};
