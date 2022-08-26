import {ActionTypes} from '../action/actionList';

const intialState = {
  userDetails: {},
};

export function userDetailsReducer(state = intialState, action: any) {
  switch (action.type) {
    case ActionTypes.USER_DETAILS:
      return {...state, userDetails: action.payload};
    default:
      return state;
  }
}
