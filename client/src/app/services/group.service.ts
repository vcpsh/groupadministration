import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {MemberActionTypes} from '../actions/member.actions';
import {VotedGroupActionTypes} from '../actions/voted-group.actions';
import {AppState} from '../models/app.state';
import {GroupType, IGroupState} from '../models/group.state';
import {IMinimalMember} from '../models/member.state';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private _api: RestService;

  constructor(
    rest: RestService,
    private _store: Store<AppState>,
  ) {
    this._api = rest.all('group');
  }

  public getPossibleMembers(group: IGroupState): Promise<IMinimalMember[]> {
    return this._api.get({url: [group.Dn, 'possiblemembers']})
      .then(res => {
        return res as IMinimalMember[];
      });
  }

  public setMembers(group: IGroupState, memberIds: string[]): Promise<void> {
    return this._api.post({url: [group.Dn, 'members'], content: memberIds})
      .then(_ => {
        group.MemberIds = memberIds;
        return;
      });
  }

  public loadMembers(group: IGroupState): Promise<void> {
    if (group._membersLoaded) {
      return Promise.resolve();
    }
    return this._api.get({ url: [group.Dn, 'members']})
      .then(res => {
        this._store.dispatch({
          type: MemberActionTypes.ADD_MULTIPLE,
          members: res,
        });
        switch (group.Type) {
          case GroupType.Division:
            break;
          case GroupType.Group:
            break;
          case GroupType.Tribe:
            break;
          case GroupType.TribeGs:
            break;
          case GroupType.TribeLr:
            break;
          case GroupType.TribeLv:
            break;
          case GroupType.TribeSl:
            break;
          case GroupType.VotedGroup:
            this._store.dispatch({
              type: VotedGroupActionTypes.MEMBERS_LOADED,
              dn: group.Dn,
            });
            break;

        }
       });
  }
}
