import {combineReducers} from 'redux-loop';
import game from './game';
import skaters from './skaters';
import skater from './skater';

export default combineReducers({
  game,
  skaters,
  skater
});
