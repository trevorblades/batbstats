import {createAction} from 'redux-actions';

export const load = createAction('SKATERS_LOAD');
export const success = createAction('SKATERS_SUCCESS');
export const failure = createAction('SKATERS_FAILURE');
