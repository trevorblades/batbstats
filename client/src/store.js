import reducers from './reducers';
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {install} from 'redux-loop';

export default createStore(reducers, composeWithDevTools(install()));
