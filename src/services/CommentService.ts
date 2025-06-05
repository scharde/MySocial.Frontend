import {
  ICommentPageResponse,
  ICommentRequest,
  ICommentResponse,
} from "@/model/Feed";
import httpService from "./httpService";
import { API_Comments } from "@/Utils/constant.";

export const getCommentsAsync = async (
  postId: string,
  page: number,
  pageSize: number,
): Promise<ICommentPageResponse> => {
  let url = `${API_Comments}?postId=${postId}&page=${page}&pageSize=${pageSize}`;
  let result = await httpService.get(url);
  return result.data;
};

export const postCommentsAsync = async (
  data: ICommentRequest,
): Promise<ICommentResponse> => {
  let result = await httpService.post(API_Comments, data);
  return result.data;
};
