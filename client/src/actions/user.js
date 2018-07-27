import {createAction} from 'redux-actions';

export const logIn = createAction('USER_LOG_IN');
export const logOut = createAction('USER_LOG_OUT');
export const renewToken = createAction('USER_RENEW_TOKEN');
export const success = createAction('USER_SUCCESS');
export const failure = createAction('USER_FAILURE');
