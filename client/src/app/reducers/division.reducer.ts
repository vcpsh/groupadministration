import {DivisionActions, DivisionActionTypes, DivisionAdd, DivisionAddMultiple} from '../actions/division.actions';
import {IDivisionState} from '../models/division.state';

export function divisionReducer(state: IDivisionState[], action: DivisionActions) {
  switch (action.type) {
    case DivisionActionTypes.ADD: {
      const a = action as DivisionAdd;
      return state.concat(a.division);
    }
    case DivisionActionTypes.ADD_MULTIPLE: {
      const a = action as DivisionAddMultiple;
      return state.concat(a.divisions);
    }
    case DivisionActionTypes.RESET:
      return [];
    default:
      return state;
  }
}
