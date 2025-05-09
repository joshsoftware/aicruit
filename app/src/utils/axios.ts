import axios, { AxiosError } from "axios";
import { RAILS_API_URL as API_URL, PYTHON_API_URL } from "@/services/env";
import {
  networkErrorToast,
  technicalGlitchToast,
} from "@/constants/toastmessages";
import { toast } from "sonner";
import { createAcceptHeaderValue } from "@/services/utils";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: createAcceptHeaderValue(1),
  },
});

const pythonAxiosInstance = axios.create({
  baseURL: PYTHON_API_URL,
});

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

        toast.error(data.message);
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
