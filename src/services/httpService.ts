import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { store } from "@/redux/store";
import { logoutActionAsync, refreshTokenActionAsync } from "@/redux/userSlice";
import { IResponseBase } from "@/model/Common";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  skipRefreshToken?: boolean;
}

export interface ApiError {
  success: boolean;
  message: string;
  httpStatusCode: number;
}

const SERVICE_TIMEOUT = 100000;
const BASE_URL = import.meta.env.VITE_APP_API_SERVER_URL;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: SERVICE_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.defaults.withCredentials = true;
let isLoggingOut = false;

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    const prevRequest: any = error.config;

    if (
      error.response?.status === 401 &&
      !prevRequest?.sent &&
      !prevRequest?.skipRefreshToken &&
      !isLoggingOut
    ) {
      prevRequest.sent = true;
      isLoggingOut = true;

      try {
        await store.dispatch(logoutActionAsync());
        await store.dispatch({ type: "RESET" });
        window.location.href = "/login";
      } catch (err) {
        // Still logout, even if error occurs
        await store.dispatch(logoutActionAsync());
        await store.dispatch({ type: "RESET" });
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

const exportAxios = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};

export default exportAxios;
