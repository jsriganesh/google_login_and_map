import { defaultLocation } from '../../utils/constant';
import {ActionTypes} from '../action/actionList';

const intialState = {
  selectedStartPoint: {},
  selectedEndPoint: {},
};

export function selectedLatLongReducer(state = intialState, action: any) {
  switch (action.type) {
    case ActionTypes.SELECTED_START_POINT:
      return {...state, selectedStartPoint: action.payload};
    case ActionTypes.SELECTED_END_POINT:
        return {...state, selectedEndPoint: action.payload};
    default:
      return state;
  }
}
