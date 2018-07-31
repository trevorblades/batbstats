import {createAction} from 'redux-actions';

export const save = createAction('SKATER_SAVE');
export const success = createAction('SKATER_SUCCESS');
export const failure = createAction('SKATER_FAILURE');
export const reset = createAction('SKATER_RESET');
