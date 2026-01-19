import axios from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { handleApiError } from "./error-handler";
// import { getAccessToken } from "@/lib/auth-store";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  // withCredentials: true,
  withCredentials: false,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // const token = getAccessToken();

    // if (token) {
    //   config.headers.set("Authorization", `Bearer ${token}`);
    // }

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
