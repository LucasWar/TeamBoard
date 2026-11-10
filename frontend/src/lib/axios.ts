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

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = api.get("/auth/refresh")
            .then((res) => {
              const newToken = res.data.accessToken;
              localStorage.setItem(localStorageKeys.ACCESS_TOKEN, newToken);
              return newToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;
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
