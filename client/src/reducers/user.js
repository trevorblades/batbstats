import Frisbee from 'frisbee';
import jwtDecode from 'jwt-decode';
import store from 'store';
import {Cmd, loop} from 'redux-loop';
import {TOKEN_KEY} from '../constants';
import {failure, logIn, logOut, renewToken, success} from '../actions/user';
import {handleActions} from 'redux-actions';

function userFromToken(token) {
  try {
    const {exp, ...claims} = jwtDecode(token);
    if (!exp || Date.now() > exp * 1000) {
      return null;
    }

    delete claims.iat;
    delete claims.sub;

    return {
      ...claims,
      token
    };
  } catch (error) {
    return null;
  }
}

async function authenticate(email, password) {
  const response = await api.auth(email, password).post('/auth');
  api.auth();

  if (response.err) {
    throw response.body;
  }
  return response.body;
}

async function renew(token) {
  const response = await api.jwt(token).post('/auth/renew');
  api.jwt(null);

  if (response.err) {
    throw response.body;
  }
  return response.body;
}

const api = new Frisbee({
  baseURI: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

const setJwt = api.jwt.bind(api);
const defaultState = {
  loading: false,
  error: null,
  data: userFromToken(store.get(TOKEN_KEY))
};

export default handleActions(
  {
    [logIn]: (state, {payload}) =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(authenticate, {
          successActionCreator: success,
          failActionCreator: failure,
          args: payload
        })
      ),
    [renewToken]: (state, {payload}) =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(renew, {
          successActionCreator: success,
          failActionCreator: logOut,
          args: [payload]
        })
      ),
    [success]: (state, {payload}) =>
      loop(
        {
          ...state,
          loading: false,
          data: userFromToken(payload)
        },
        Cmd.list([
          Cmd.run(setJwt, {args: [payload]}),
          Cmd.run(store.set.bind(store), {args: [TOKEN_KEY, payload]})
        ])
      ),
    [failure]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [logOut]: () =>
      loop(
        {
          ...defaultState,
          data: null
        },
        Cmd.list([
          Cmd.run(setJwt, {args: [null]}),
          Cmd.run(store.remove.bind(store), {args: [TOKEN_KEY]})
        ])
      )
  },
  defaultState
);
