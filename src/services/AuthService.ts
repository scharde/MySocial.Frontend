import {
  API_Check_Auth,
  API_Login,
  API_Refresh,
  API_Register,
} from "@/Utils/constant.";
import httpService, { type CustomAxiosRequestConfig } from "./httpService";
import { API_Logout } from "@/Utils/constant.";
import { ISignInCredentials, ISignUpRequest } from "@/model/Auth";

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expiryTime: Date;
}

export const loginAsync = async (
  login: ISignInCredentials,
): Promise<TokenResponse> => {
  const result = await httpService.post(API_Login, login, {
    skipRefreshToken: true,
    headers: {
      "Content-Type": "application/json",
      "X-Ldi-Api-Key": "",
    },
  } as CustomAxiosRequestConfig);

  return result.data;
};

export const registerAsync = async (request: ISignUpRequest) => {
  const result = await httpService.post(API_Register, request, {
    skipRefreshToken: true,
    headers: {
      "Content-Type": "application/json",
      "X-Ldi-Api-Key": "",
    },
  } as CustomAxiosRequestConfig);

  return result.data;
};

export const logoutAsync = async () => {
  await httpService.get(API_Logout);
};

export const refreshAsync = async () => {
  await httpService.post(API_Refresh, {});
};

export const checkAuthAsync = async () => {
  return await httpService.get(API_Check_Auth, {
    skipRefreshToken: true,
  } as CustomAxiosRequestConfig);
};
