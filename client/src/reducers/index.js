import games from './games';
import skater from './skater';
import user from './user';
import {combineReducers} from 'redux-loop';

export default combineReducers({
  games,
  skater,
  user
});
