import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { handleApiError } from "./error-handler";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  // Use cookies (HttpOnly) for auth; do not store tokens in JS.
  withCredentials: true,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.set("X-Request-ID", crypto.randomUUID());

    return config;
  },
  (error) => {
    console.error(error);
    Promise.reject(error)
  }
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(handleApiError(error))
);

export default api;
