import {IDivisionState} from './division.state';
import {IMemberState} from './member.state';
import {ITribeState} from './tribe.state';
import {IUserState} from './user.state';
import {IVotedGroupState} from './voted-group.state';

export interface AppState {
  User: IUserState | null;
  Divisions: IDivisionState[];
  Tribes: ITribeState[];
  Members: { [key: string]: IMemberState };
  VotedGroups: IVotedGroupState[];
}

export const InitialState: AppState = {
  User: null,
  Tribes: [],
  Divisions: [],
  Members: {},
  VotedGroups: [],
};
