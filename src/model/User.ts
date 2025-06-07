export enum UserLoggedInType {
  None,
  Yes = 1,
  No = 2,
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
  title?: string;
}

const defaultUserData: IUser = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  avatar: "",
  title: "",
};

export enum LoadingStatus {
  None,
  Loading,
  Loaded = 2,
  Error = 3,
}

export interface UserState {
  userLoggedInStatus: UserLoggedInType;
  user: IUser | null;
  userLoadingStatus: LoadingStatus;
  followingToIds: string[];
}

export const initialUserState: UserState = {
  userLoggedInStatus: UserLoggedInType.None,
  user: null,
  userLoadingStatus: LoadingStatus.None,
  followingToIds: [],
};

export interface IUserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
}
