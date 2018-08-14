import {combineReducers} from 'redux-loop';
import {handleAction} from 'redux-actions';
import {setIncludeMisses, setStance} from '../actions/settings';

export default combineReducers({
  includeMisses: handleAction(
    setIncludeMisses,
    (state, {payload}) => payload,
    false
  ),
  stance: handleAction(setStance, (state, {payload}) => payload, 'both')
});
