import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { RAILS_API_URL as API_URL, PYTHON_API_URL } from "@/services/env";
import {
  networkErrorToast,
  technicalGlitchToast,
} from "@/constants/toastmessages";
import { toast } from "sonner";
import { createAcceptHeaderValue } from "@/services/utils";
import store from "@/redux/store";
import { resetAuth } from "@/redux/authSlice";
import LocalStorage from "@/utils/localStore";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: createAcceptHeaderValue(1),
  },
});

const pythonAxiosInstance = axios.create({
  baseURL: PYTHON_API_URL,
});

// Attach Authorization header from the latest Redux state before every request
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const state = store.getState();
    const token = state?.auth?.token ?? null;
    if (token) {
      const headers: Record<string, any> = (config.headers as any) ?? {};
      // If caller already set Authorization, keep it; else set from store
      if (!("Authorization" in headers)) {
        headers["Authorization"] = token as string;
      }
      (config.headers as any) = headers;
    }
  } catch (_e) {
    // no-op
  }
  return config;
});

// Global response interceptor: on 401/403 clear auth and redirect to sign-in
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        try {
          // Clear persisted auth
          LocalStorage.removeItem(LocalStorage.AUTH_USER_DATA);
          // Reset redux auth state
          store.dispatch(resetAuth());
        } catch (_e) {}
        // Redirect to login/home
        if (typeof window !== "undefined") {
          // Prefer sign-in page if available
          window.location.assign("/signin");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { pythonAxiosInstance };

export function handleErrorResponse<T extends { message: string }>(
  error: unknown
) {
  if (error instanceof AxiosError) {
    const axiosError = error as AxiosError<T>;
    const response = axiosError.response;

    if (response) {
      if (response.status === 500) {
        return technicalGlitchToast();
      }

      if (response.data) {
        const data = response.data;

        toast.error((data as any).message);
        return;
      }
    }

    if (axiosError.message === "Network Error") {
      return networkErrorToast();
    }

    return technicalGlitchToast();
  } else {
    technicalGlitchToast();
  }
}
