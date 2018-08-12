import form from './form';
import games from './games';
import settings from './settings';
import user from './user';
import {combineReducers} from 'redux-loop';

export default combineReducers({
  form,
  games,
  settings,
  user
});
