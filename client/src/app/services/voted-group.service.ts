import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {VotedGroupActionTypes} from '../actions/voted-group.actions';
import {AppState} from '../models/app.state';
import {IUserState} from '../models/user.state';
import {IVotedGroupState} from '../models/voted-group.state';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class VotedGroupService {
  private _api: RestService;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>, rest: RestService) {
    this._api = rest.all('votedgroup');
    this._subscriptions.push(this._store.pipe<IUserState | null>(select('User')).subscribe(v => this.userChanged(v)));
  }

  private userChanged(user: IUserState | null) {
    if (user) {
      this._api.list<IVotedGroupState>({}).then(groups => {
        if (groups) {
          this._store.dispatch({
            type: VotedGroupActionTypes.ADD_MULTIPLE,
            groups,
          });
        } else {
          this._store.dispatch({
            type: VotedGroupActionTypes.RESET,
          });
        }
      });
    } else {
      this._store.dispatch({
        type: VotedGroupActionTypes.RESET,
      });
    }
  }

  public loadGroupMembers(TribeId: string) {

  }

  public createVotedGroup(DisplayName: string, Dn: string, DivisionId: string, Email: string) {
    this._api.post(
      {content: {DisplayName, DivisionId: DivisionId, Dn, OfficialMail: Email, Id: DisplayName.toLocaleLowerCase().replace(' ', '_')}})
      .then(res => {
        this._store.dispatch({
          type: VotedGroupActionTypes.ADD,
          group: res,
        });
      });
  }
}
