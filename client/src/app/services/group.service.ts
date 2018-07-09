import { Injectable } from '@angular/core';
import {IGroupState} from '../models/group.state';
import {IMinimalMember} from '../models/member.state';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private _api: RestService;

  constructor(
    rest: RestService,
  ) {
    this._api = rest.all('group');
  }

  public getPossibleMembers(group: IGroupState): Promise<IMinimalMember[]> {
    return this._api.get({ url: [group.Dn, 'possiblemembers']})
      .then(res => {
        return res as IMinimalMember[];
      });
  }

  public setMembers(group: IGroupState, memberIds: string[]): Promise<void> {
    return this._api.post({ url: [group.Dn, 'members'], content: memberIds})
      .then(_ => {
        group.MemberIds = memberIds;
        return;
      });
  }
}
