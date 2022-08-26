import {combineReducers} from 'redux';
import {userDetailsReducer} from './userDetailsReducer';
import {selectedLatLongReducer} from './selectedLatLongReducer';

export default combineReducers({
  userDetailsReducer,
  selectedLatLongReducer
});
