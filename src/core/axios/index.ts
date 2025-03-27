import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const commonHeaders = {
  'content-type': 'application/json',
};

const defaultConf = {
  headers: commonHeaders,
};

export const generateConf = (conf: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({ ...defaultConf, ...conf });
  instance.interceptors.response.use(
    function (r) {
      return r;
    },
    function (err) {
      const response = err.response;
      console.error('API ERROR:', response);
      return Promise.reject(response);
    },
  );
  return instance;
};
