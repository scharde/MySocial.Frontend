import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  initialUserState,
  type IUserProfileResponse,
  UserLoggedInType,
} from "@/model/User";
import { RootState } from "@/redux/store";
import {
  checkAuthAsync,
  logoutAsync,
  refreshAsync,
} from "@/services/AuthService";

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
      console.log("Calling logout");
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
      });
  },
});

export default userSlice.reducer;
