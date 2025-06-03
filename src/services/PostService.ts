import httpService, { type CustomAxiosRequestConfig } from "./httpService";
import { API_Post } from "@/Utils/constant.";

export interface ICreatePostRequest {
  content: string;
}

export const createPostAsync = async (data: ICreatePostRequest) => {
  let result = await httpService.post(API_Post, data);
  return result.data;
};

export const getPostAsync = async (page: number, pageSize: number = 10) => {
  let result = await httpService.get(
    `${API_Post}?page=${page}&pageSize=${pageSize}`,
  );
  return result.data;
};
