import httpService, { type CustomAxiosRequestConfig } from "./httpService";
import { API_Post, API_User } from "@/Utils/constant.";
import { IUser } from "@/model/User";

export const getUserAsync = async (): Promise<IUser> => {
  let result = await httpService.get(API_User);
  return result.data;
};
