import {createAction} from 'redux-actions';

export const load = createAction('SKATER_LOAD');
export const success = createAction('SKATER_SUCCESS');
export const failure = createAction('SKATER_FAILURE');
