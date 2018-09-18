import {
  VotedGroupActions,
  VotedGroupActionTypes,
  VotedGroupAdd,
  VotedGroupAddMultiple, VotedGroupMembersLoaded,
  VotedGroupUpdate,
} from '../actions/voted-group.actions';
import {IVotedGroupState} from '../models/voted-group.state';

export function votedGroupReducer(state: IVotedGroupState[], action: VotedGroupActions) {
  switch (action.type) {
    case VotedGroupActionTypes.ADD: {
      const a = action as VotedGroupAdd;
      return state.concat(a.group);
    }
    case VotedGroupActionTypes.ADD_MULTIPLE: {
      const a = action as VotedGroupAddMultiple;
      return state
        .concat(a.groups);
    }
    case VotedGroupActionTypes.MEMBERS_LOADED: {
      const a = action as VotedGroupMembersLoaded;
      return state.map(g => {
        if (g.Dn === a.dn) {
          g._membersLoaded = true;
        }
        return g;
      });
    }
    case VotedGroupActionTypes.UPDATE: {
      const a = action as VotedGroupUpdate;
      return state.map(vg => {
        return vg.Dn === a.group.Dn ? a.group : vg;
      });
    }
    case VotedGroupActionTypes.RESET:
      return [];
    default:
      return state;
  }
}
