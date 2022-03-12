import axios from 'axios';

export const baseHttps = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
