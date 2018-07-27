import games from './games';
import skater from './skater';
import {combineReducers} from 'redux-loop';

export default combineReducers({
  games,
  skater
});
