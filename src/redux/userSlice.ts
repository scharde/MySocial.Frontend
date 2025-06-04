import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  initialUserState,
  IUser,
  type IUserProfileResponse,
  UserLoggedInType,
} from "@/model/User";
import { RootState } from "@/redux/store";
import {
  checkAuthAsync,
  logoutAsync,
  refreshAsync,
} from "@/services/AuthService";
import { getUserAsync } from "@/services/userService.cs";

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

export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
        state.loading = true;
      })
      .addCase(getUserActionAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getUserActionAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
