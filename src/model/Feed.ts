export interface IFeedPostResponse {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  score: number;
  commentCount: number;
  createdDateUtc: Date;
}

export interface IGetFeedPostResponse {
  totalCount: number;
  page: number;
  pageSize: number;
  items: IFeedPostResponse[];
}

export interface IFeedState {
  posts: IFeedPostResponse[];
  loading: boolean;
  error: string | null;
  page: number;
  totalCount: number;
  pageSize: number;
  hasMore: boolean;
}

export const initialFeedState: IFeedState = {
  posts: [],
  loading: false,
  error: null,
  totalCount: 0,
  page: 1,
  pageSize: 10,
  hasMore: false,
};
