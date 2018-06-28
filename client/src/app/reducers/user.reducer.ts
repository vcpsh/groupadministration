import {UserActions, UserActionTypes} from '../actions/user.actions';
import {IUserState} from '../models/user.state';

export function userReducer(state: IUserState | null, action: UserActions): IUserState | null {
  switch (action.type) {
    case UserActionTypes.LOGIN: {
      return action.user;
    }
    case UserActionTypes.LOGOUT:
      return null;
    default:
      return state;
  }
}
