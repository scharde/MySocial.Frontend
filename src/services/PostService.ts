import httpService, { type CustomAxiosRequestConfig } from "./httpService";
import { API_Follow, API_Post, API_Post_Vote } from "@/Utils/constant.";
import { Axios } from "axios";

export interface ICreatePostRequest {
  content: string;
}

export interface IFollowToggleRequest {
  followerId: string;
  followeeId: string;
}

export interface IFollowToggleResponse {
  followerId: string;
  followeeId: string;
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

export const postVotesAsync = async (postId: string, vote: number) => {
  await httpService.post(API_Post_Vote, { postId: postId, vote: vote });
};
