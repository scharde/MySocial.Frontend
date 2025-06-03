export enum UserLoggedInType {
  None,
  Yes = 1,
  No = 2,
}

export interface UserState {
  userLoggedInStatus: UserLoggedInType;
}

export const initialUserState: UserState = {
  userLoggedInStatus: UserLoggedInType.None,
};

export interface IUserProfileResponse {
  firstName: string;
  lastName: string;
  email: string;
}
