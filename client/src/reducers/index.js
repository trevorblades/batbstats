import {combineReducers} from 'redux-loop';
import skaters from './skaters';
import skater from './skater';

export default combineReducers({
  skaters,
  skater
});
