import {combineReducers} from 'redux';
import auth from '../services/userstate';

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
