import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API}/nest-shop`,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const response = await api.post("/auth/refresh");
        const accessToken = response.data.accessToken;

        localStorage.setItem("token", accessToken);

        const config = error.config;
        if (config && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
          return api.request(config);
        }

        return Promise.reject(error);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
