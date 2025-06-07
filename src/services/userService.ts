import httpService, { type CustomAxiosRequestConfig } from "./httpService";
import { API_Follow, API_Post, API_User } from "@/Utils/constant.";
import { IUser } from "@/model/User";
import { IFollowToggleResponse } from "@/services/PostService";

export const getUserAsync = async (): Promise<IUser> => {
  let result = await httpService.get(API_User);
  return result.data;
};

export const followUserAsync = async (
  followeeId: string,
): Promise<IFollowToggleResponse> => {
  const result = await httpService.post(`${API_Follow}/${followeeId}/toggle`);
  return result.data;
};

export const getFollowerListAsync = async (): Promise<string[]> => {
  const result = await httpService.get(API_Follow);
  return result.data;
};
