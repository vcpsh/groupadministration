import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs/internal/Subscription';
import {MemberActionTypes} from '../actions/member.actions';
import {AppState} from '../models/app.state';
import {IUserState} from '../models/user.state';
import {RestService} from './rest.service';

@Injectable()
export class MemberService {
  private _api: RestService;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>, rest: RestService) {
    this._api = rest.all('member');
    this._subscriptions.push(this._store.pipe<IUserState | null>(select('User')).subscribe(v => this.userChanged(v)));
  }

  private userChanged(user: IUserState | null) {
    if (!user) {
      this._store.dispatch({
        type: MemberActionTypes.RESET,
      });
    }
  }
}
