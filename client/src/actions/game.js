import {createAction} from 'redux-actions';

export const load = createAction('GAME_LOAD');
export const success = createAction('GAME_SUCCESS');
export const failure = createAction('GAME_FAILURE');
