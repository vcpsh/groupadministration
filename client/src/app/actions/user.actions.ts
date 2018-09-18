import {Action} from '@ngrx/store';
import {IUserState} from '../models/user.state';

export enum UserActionTypes {
  LOGIN = '[User] LOGIN',
  LOGOUT = '[User] LOGOUT'
}

export class UserLogin implements Action {
  readonly type = UserActionTypes.LOGIN;

  constructor(public user: IUserState | null) {
  }
}

export class UserLogout implements Action {
  readonly type = UserActionTypes.LOGOUT;
}

export type UserActions = UserLogin | UserLogout;
