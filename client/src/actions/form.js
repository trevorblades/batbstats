import {createAction} from 'redux-actions';

export const submit = createAction('FORM_SUBMIT');
export const success = createAction('FORM_SUCCESS');
export const failure = createAction('FORM_FAILURE');
