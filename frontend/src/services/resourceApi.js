import axios from 'axios';

const resourceApi = axios.create({ baseURL: '/api' });

resourceApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('@CoreFlow:token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default resourceApi;
