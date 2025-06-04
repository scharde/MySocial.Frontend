import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IFeedPostResponse,
  IGetFeedPostResponse,
  initialFeedState,
  VoteType,
} from "@/model/Feed";
import { IUserProfileResponse } from "@/model/User";
import { RootState } from "@/redux/store";
import { createPostAsync, getPostAsync } from "@/services/PostService";

export const createPostActionAsync = createAsyncThunk<
  IUserProfileResponse,
  string
>("feed/create-post", async (content) => {
  const response = await createPostAsync({ content: content });
  return response.data;
});

export const getPostActionAsync = createAsyncThunk<
  IGetFeedPostResponse,
  number
>("feed/get-feeds", async (page, { getState }) => {
  const { feedState } = getState() as RootState;
  return await getPostAsync(page, feedState.pageSize);
});

export const feedSlice = createSlice({
  name: "feed",
  initialState: initialFeedState,
  reducers: {
    updateVoteAction: (
      state,
      action: { payload: { postId: string; vote: number } },
    ) => {
      const index = state.posts.findIndex(
        (x: IFeedPostResponse) => x.id === action.payload.postId,
      );

      if (index === -1) return;

      const post = state.posts[index];

      if (post.userVote === action.payload.vote) {
        // Same vote clicked again → remove the vote
        post.userVote = VoteType.NoVotes;
        if (action.payload.vote === VoteType.UpVote) {
          post.upVotes -= 1;
        } else if (action.payload.vote === VoteType.DownVote) {
          post.downVotes -= 1;
        }
      } else {
        // Vote changed or first time voting
        // First, remove old vote if any
        if (post.userVote === VoteType.UpVote) {
          post.upVotes -= 1;
        } else if (post.userVote === VoteType.DownVote) {
          post.downVotes -= 1;
        }

        // Then apply new vote
        post.userVote = action.payload.vote;
        if (action.payload.vote === VoteType.UpVote) {
          post.upVotes += 1;
        } else if (action.payload.vote === VoteType.DownVote) {
          post.downVotes += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPostActionAsync.fulfilled, (state, action) => {
      state.posts = action.payload.items || [];
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.totalCount = action.payload.totalCount;
    });
  },
});

export const { updateVoteAction } = feedSlice.actions;

export default feedSlice.reducer;
