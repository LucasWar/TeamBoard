import axios from "axios";
import { localStorageKeys } from "../app/config/localStorageKeys";
import { generateUUID } from "../app/utils/generateUUID";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
  const organizationId = localStorage.getItem(localStorageKeys.ORGANIZATION_ID);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (organizationId) {
    config.headers['x-organization-id'] = organizationId;
  }

  const method = config.method?.toLowerCase();
  if (["put", "patch", "post"].includes(method!)) {
    config.headers["x-idempotency-key"] = generateUUID();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.get("/auth/refresh");
        const newToken = res.data.accessToken;

        localStorage.setItem(localStorageKeys.ACCESS_TOKEN, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {  
        localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);