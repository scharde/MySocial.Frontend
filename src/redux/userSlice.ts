import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  initialUserState,
  IUser,
  type IUserProfileResponse,
  LoadingStatus,
  UserLoggedInType,
} from "@/model/User";
import { RootState } from "@/redux/store";
import {
  checkAuthAsync,
  logoutAsync,
  refreshAsync,
} from "@/services/AuthService";
import { getFollowerListAsync, getUserAsync } from "@/services/userService";
import { cleanAllStorage } from "@/Utils/storage";
import { feedSlice } from "@/redux/feedSlice.";

export const checkAuthActionAsync = createAsyncThunk<IUserProfileResponse>(
  "auth/check-auth",
  async () => {
    const response = await checkAuthAsync();
    return response.data;
  },
  {
    condition: (_, { getState }) => {
      const { userState } = getState() as RootState;
      if (userState.userLoggedInStatus == UserLoggedInType.Yes) {
        return false;
      }

      return true;
    },
  },
);

export const logoutActionAsync = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      cleanAllStorage();
      await logoutAsync();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const refreshTokenActionAsync = createAsyncThunk(
  "auth/refreshTokenActionAsync",
  async (_, { rejectWithValue }) => {
    try {
      await refreshAsync();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getUserActionAsync = createAsyncThunk<IUser>(
  "user/getUserActionAsync",
  async (_, { rejectWithValue }) => {
    try {
      return await getUserAsync();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getFollowingActionAsync = createAsyncThunk<string[]>(
  "user/getFollowingActionAsync",
  async (_, { rejectWithValue }) => {
    try {
      return await getFollowerListAsync();
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    followingToggleAction: (
      state,
      action: { payload: { followingToId: string } },
    ) => {
      let { followingToId } = action.payload;
      state.followingToIds = state.followingToIds.includes(followingToId)
        ? state.followingToIds.filter((v) => v !== followingToId)
        : [...state.followingToIds, followingToId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase("RESET", () => initialUserState)
      .addCase(checkAuthActionAsync.fulfilled, (state) => {
        state.userLoggedInStatus = UserLoggedInType.Yes;
      })
      .addCase(checkAuthActionAsync.rejected, (state) => {
        state.userLoggedInStatus = UserLoggedInType.No;
      })
      .addCase(logoutActionAsync.fulfilled, (state) => {
        state.userLoggedInStatus = UserLoggedInType.No;
      })
      .addCase(getUserActionAsync.pending, (state) => {
        state.userLoadingStatus = LoadingStatus.Loading;
      })
      .addCase(getUserActionAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userLoadingStatus = LoadingStatus.Loaded;
      })
      .addCase(getUserActionAsync.rejected, (state) => {
        state.userLoadingStatus = LoadingStatus.Error;
      })
      .addCase(getFollowingActionAsync.fulfilled, (state, action) => {
        state.followingToIds = action.payload;
      });
  },
});

export const { followingToggleAction } = userSlice.actions;

export default userSlice.reducer;
