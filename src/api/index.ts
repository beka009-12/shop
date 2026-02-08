import axios from "axios";

export const api = axios.create({
  baseURL: `$https://express-production-2192.up.railway.app/nest-shop`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
