import {Action} from '@ngrx/store';
import {IDivisionState} from '../models/division.state';

export enum DivisionActionTypes {
  ADD = '[Division] ADD',
  ADD_MULTIPLE = '[Division] ADD_MULTIPLE',
  RESET = '[Division] RESET',
}

export class DivisionAdd implements Action {
  readonly type = DivisionActionTypes.ADD;

  constructor(public division: IDivisionState) {
  }
}

export class DivisionAddMultiple implements Action {
  readonly type = DivisionActionTypes.ADD_MULTIPLE;

  constructor(public divisions: IDivisionState[]) {
  }
}

export class DivisionReset implements Action {
  readonly type = DivisionActionTypes.RESET;
}

export type DivisionActions = DivisionAdd | DivisionAddMultiple | DivisionReset;
