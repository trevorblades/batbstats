import {createAction} from 'redux-actions';

export const load = createAction('GAMES_LOAD');
export const success = createAction('GAMES_SUCCESS');
export const failure = createAction('GAMES_FAILURE');
