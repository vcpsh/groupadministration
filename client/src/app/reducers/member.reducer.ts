import {MemberActions, MemberActionTypes, MemberAdd, MemberAddMultiple} from '../actions/member.actions';
import {IMemberState} from '../models/member.state';

export function memberReducer(state: { [key: string]: IMemberState }, action: MemberActions) {
  switch (action.type) {
    case MemberActionTypes.ADD: {
      const a = action as MemberAdd;
      const newState = Object.assign({}, state);
      newState[a.member.Id] = a.member;
      return newState;
    }
    case MemberActionTypes.ADD_MULTIPLE: {
      const a = action as MemberAddMultiple;
      const newState = Object.assign({}, state);
      a.members.forEach(member => {
        newState[member.Id] = member;
      });
      return newState;
    }
    case MemberActionTypes.RESET:
      return {};
    default:
      return state;
  }
}
