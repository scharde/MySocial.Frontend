export interface IPostAuthor {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

export enum VoteType {
  NoVotes = 0,
  UpVote = 1,
  DownVote = 2,
}

export interface IFeedPostResponse {
  id: string;
  content: string;
  author: IPostAuthor;
  score: number;
  commentCount: number;
  upVotes: number;
  downVotes: number;
  createdDateUtc: Date;
  userVote: VoteType;
  userBookmarked: boolean;
}

export interface PageResult<T> {
  totalCount: number;
  page: number;
  pageSize: number;
  items: T[];
}

export interface IGetFeedPostResponse extends PageResult<IFeedPostResponse> {}

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

export interface ICommentRequest {
  postId: string;
  parentCommentId: string;
  content: string;
}

export interface ICommentResponse {
  id: string;
  author: IPostAuthor;
  parentCommentId: string;
  content: string;
  score: number;
  createdDateUtc: Date;
}

export interface ICommentPageResponse extends PageResult<ICommentResponse> {}
