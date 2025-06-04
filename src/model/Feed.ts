export interface IPostAuthor {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  isFollowing: boolean;
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
  timestamp: string;
  userVote: VoteType;
  userBookmarked: boolean;
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
