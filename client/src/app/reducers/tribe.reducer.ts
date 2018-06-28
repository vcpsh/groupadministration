import {TribeActions, TribeActionTypes, TribeAdd, TribeAddMultiple} from '../actions/tribe.actions';
import {UserActionTypes} from '../actions/user.actions';
import {ITribeState} from '../models/tribe.state';

export function tribeReducer(state: ITribeState[], action: TribeActions) {
  switch (action.type) {
    case TribeActionTypes.ADD: {
      const a = action as TribeAdd;
      return state.concat(a.tribe);
    }
    case TribeActionTypes.ADD_MULTIPLE: {
      const a = action as TribeAddMultiple;
      return state
        .concat(a.tribes);
    }
    case TribeActionTypes.RESET:
      return [];
    default:
      return state;
  }
}
