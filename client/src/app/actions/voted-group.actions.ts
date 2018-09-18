import {Action} from '@ngrx/store';
import {IVotedGroupState} from '../models/voted-group.state';

export enum VotedGroupActionTypes {
  ADD = '[VotedGroup] ADD',
  ADD_MULTIPLE = '[VotedGroup] ADD_MULTIPLE',
  MEMBERS_LOADED = '[VotedGroup] MEMBERS_LOADED',
  UPDATE = '[VotedGroup] UPDATE',
  RESET = '[VotedGroup] RESET',
}

export class VotedGroupAdd implements Action {
  readonly type = VotedGroupActionTypes.ADD;

  constructor(public group: IVotedGroupState) {
  }
}

export class VotedGroupAddMultiple implements Action {
  readonly type = VotedGroupActionTypes.ADD_MULTIPLE;

  constructor(public groups: IVotedGroupState[]) {
  }
}

export class VotedGroupMembersLoaded implements Action {
  readonly type = VotedGroupActionTypes.MEMBERS_LOADED;

  constructor(public dn: string) {}
}

export class VotedGroupUpdate implements Action {
  readonly type = VotedGroupActionTypes.UPDATE;
  constructor(public group: IVotedGroupState) {}
}

export class VotedGroupReset implements Action {
  readonly type = VotedGroupActionTypes.RESET;
}

export type VotedGroupActions = VotedGroupAdd | VotedGroupAddMultiple | VotedGroupMembersLoaded | VotedGroupUpdate | VotedGroupReset;
