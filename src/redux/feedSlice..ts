import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IGetFeedPostResponse, initialFeedState } from "@/model/Feed";
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
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPostActionAsync.fulfilled, (state, action) => {
      state.posts = action.payload.items;
      state.page = action.payload.page;
      state.pageSize = action.payload.pageSize;
      state.totalCount = action.payload.totalCount;
    });
  },
});

export default feedSlice.reducer;
