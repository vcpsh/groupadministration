import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {OidcService, UserModel} from '@vcpsh/sso-client-lib';
import {UserActionTypes} from '../actions/user.actions';
import {AppState} from '../models/app.state';
import {IUserState} from '../models/user.state';

@Injectable()
export class UserService {
  constructor(
    private _oicd: OidcService,
    private _store: Store<AppState>,
  ) {
    this._oicd.UserChanged = user => this.userChanged(user);
  }

  private userChanged(user: UserModel | null) {
    if (user) {
      let tribeAdmin: string[] = [];
      if (user.profile.is_tribe_gs) {
        tribeAdmin = tribeAdmin.concat(user.profile.is_tribe_gs);
      }
      if (user.profile.is_tribe_sl) {
        tribeAdmin = tribeAdmin.concat(user.profile.is_tribe_sl);
      }

      const u: IUserState = {
        Name: user.profile.preferred_username,
        Divisions: user.profile.division_member
          ? (Array.isArray(user.profile.division_member)
            ? user.profile.division_member
            : [user.profile.division_member])
          : [],
        DivisionsLgs: user.profile.is_division_lgs
          ? (Array.isArray(user.profile.is_division_lgs)
            ? user.profile.is_division_lgs
            : [user.profile.is_division_lgs])
          : [],
        Tribes: user.profile.tribe_member
          ? (Array.isArray(user.profile.tribe_member)
            ? user.profile.tribe_member
            : [user.profile.tribe_member])
          : [],
        TribesAdmin: tribeAdmin
      };
      this._store.dispatch({
        type: UserActionTypes.LOGIN,
        user: u,
      });
    } else {
      this._store.dispatch({
        type: UserActionTypes.LOGOUT,
      });
    }
  }
}
