import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import {VotedGroupActionTypes} from '../actions/voted-group.actions';
import {AppState} from '../models/app.state';
import {IUserState} from '../models/user.state';
import {IVotedEntryState, IVotedGroupState} from '../models/voted-group.state';
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
          groups.forEach(g => g._membersLoaded = false);
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

  public addMembers(group: IVotedGroupState, newMembers: { StartEvent: string, EndEvent: string, StartDate: Date, NewMembers: string[]}) {
    return this._api.post({ url: `${group.Dn}/addMembers`, content: newMembers})
      .then(res => {
        this._store.dispatch({
          type: VotedGroupActionTypes.UPDATE,
          group: res,
        });
      });
  }

  public removeMembers(Group: IVotedGroupState, removedMembers: { EndEvent: string, EndDate: Date, RemovedMembers: IVotedEntryState[]}) {
    return this._api.post({ url: [Group.Dn, 'removeMembers'], content: removedMembers})
      .then(res => {
        console.log(res);
        this._store.dispatch({
          type: VotedGroupActionTypes.UPDATE,
          group: res,
        });
      });
  }
}
