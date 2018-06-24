import {Action} from '@ngrx/store';
import {ITribeState} from '../models/tribe.state';

export enum TribeActionTypes {
  ADD = '[Tribe] ADD',
  ADD_MULTIPLE = '[Tribe] ADD_MULTIPLE',
  RESET = '[Tribe] RESET',
}

export class TribeAdd implements Action {
  readonly type = TribeActionTypes.ADD;
  constructor(public tribe: ITribeState) {
  }
}

export class TribeAddMultiple implements Action {
  readonly type = TribeActionTypes.ADD_MULTIPLE;
  constructor(public tribes: ITribeState[]) {}
}

export class TribeReset implements Action {
  readonly type = TribeActionTypes.RESET;
}

export type TribeActions = TribeAdd | TribeReset | TribeAddMultiple;
