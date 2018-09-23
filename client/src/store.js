import reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createStore} from 'redux';
import {install} from 'redux-loop';

export default createStore(reducers, composeWithDevTools(install()));
