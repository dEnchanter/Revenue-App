import axios from 'axios';
import { Baseurl } from './constants';

const instance = axios.create({
  baseURL: Baseurl + '/',
});

instance.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  config.headers['Authorization'] = `Bearer ${token}`;
  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';
  config.headers['x-token'] = '';
  return config;
});

export default instance;