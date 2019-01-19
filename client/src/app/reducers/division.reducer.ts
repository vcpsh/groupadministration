import {DivisionActions, DivisionActionTypes, DivisionAdd, DivisionAddMultiple} from '../actions/division.actions';
import {IDivisionState} from '../models/division.state';

export function divisionReducer(state: IDivisionState[], action: DivisionActions) {
  switch (action.type) {
    case DivisionActionTypes.ADD: {
      const a = action as DivisionAdd;
      if (state.find(div => div.Id === a.division.Id)) {
        return state;
      }
      return state.concat(a.division);
    }
    case DivisionActionTypes.ADD_MULTIPLE: {
      const a = action as DivisionAddMultiple;
      a.divisions.forEach(div => {
        if (!state.find(div2 => div2.Id === div.Id)) {
          state.push(div);
        }
      });
      return state;
    }
    case DivisionActionTypes.RESET:
      return [];
    default:
      return state;
  }
}
