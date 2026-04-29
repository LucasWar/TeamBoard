import axios from "axios";
import { localStorageKeys } from "../app/config/localStorageKeys";

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

  return config;
});

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const res = await api.post("/auth/refresh");
//         const newToken = res.data.accessToken;

//         localStorage.setItem(localStorageKeys.ACCESS_TOKEN, newToken);

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return api(originalRequest);
//       } catch {
//         // logout
//         localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
//         window.location.href = "/login";
//       }
//     }

//     return Promise.reject(error);
//   }
// );