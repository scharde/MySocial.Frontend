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

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const prevRequest: any = error.config;

    console.log("Prev Request", prevRequest);
    if (
      error.response?.status === 401 &&
      !prevRequest?.sent &&
      !prevRequest?.skipRefreshToken
    ) {
      prevRequest.sent = true;

      try {
        const result = await store.dispatch(refreshTokenActionAsync());
        console.log("Refresh token Request", result.meta.requestStatus);
        if (result.meta.requestStatus === "fulfilled") {
          console.log("Trying prev request again");
          return axiosInstance(prevRequest); // Retry original request
        }

        // If refresh failed
        await store.dispatch(logoutActionAsync());
        await store.dispatch({ type: "RESET" });
        window.location.href = "/login";
        return Promise.reject(error);
      } catch (err) {
        await store.dispatch(logoutActionAsync());
        await store.dispatch({ type: "RESET" });
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // If it's already retried, or skipRefreshToken was set
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IResponseBase>;
      let errorMessage = "Something went wrong";

      if (axiosError.response) {
        errorMessage = axiosError.response.data?.message || errorMessage;
      } else if (axiosError.request) {
        errorMessage = "No response received from the server";
      } else {
        errorMessage = "A network error occurred";
      }

      return Promise.reject({ ...error, message: errorMessage });
    }

    return Promise.reject({
      message: "An unexpected error occurred",
    } as ApiError);
  },
);

const exportAxios = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,
};

export default exportAxios;
