import {combineReducers} from 'redux-loop';
import {handleAction} from 'redux-actions';
import {setIncludeMisses} from '../actions/settings';

export default combineReducers({
  includeMisses: handleAction(
    setIncludeMisses,
    (state, {payload}) => payload,
    false
  )
});
