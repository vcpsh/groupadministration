import {Action} from '@ngrx/store';
import {IMemberState} from '../models/member.state';

export enum MemberActionTypes {
  ADD = '[Member] ADD',
  ADD_MULTIPLE = '[Member] ADD_MULTIPLE',
  RESET = '[Member] RESET',
}

export class MemberAdd implements Action {
  readonly type = MemberActionTypes.ADD;
  constructor(public member: IMemberState) {
  }
}

export class MemberAddMultiple implements Action {
  readonly type = MemberActionTypes.ADD_MULTIPLE;
  constructor(public members: IMemberState[]) {}
}

export class MemberReset implements Action {
  readonly type = MemberActionTypes.RESET;
}

export type MemberActions = MemberAdd | MemberAddMultiple | MemberReset;
