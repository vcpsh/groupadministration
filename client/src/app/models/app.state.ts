import {IDivisionState} from './division.state';
import {ITribeState} from './tribe.state';
import {IUserState} from './user.state';

export interface AppState {
  User: IUserState | null;
  Divisions: IDivisionState[];
  Tribes: ITribeState[];
}

export const InitialState: AppState = {
  User: null,
  Tribes: [],
  Divisions: [],
};
