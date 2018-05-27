import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {install} from 'redux-loop';
import reducer from './reducers';

export default createStore(reducer, composeWithDevTools(install()));
