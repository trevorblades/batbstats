import {loop, Cmd} from 'redux-loop';
import {handleActions} from 'redux-actions';
import api from '../api';
import {load, success, failure} from '../actions/game';

async function fetchGame(id) {
  const response = await api.get(`/games/${id}`);
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

const defaultState = {
  loading: false,
  error: null,
  properties: null
};

export default handleActions(
  {
    [load]: (state, {payload}) =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(fetchGame, {
          successActionCreator: success,
          failActionCreator: failure,
          args: [payload]
        })
      ),
    [failure]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [success]: (state, {payload}) => ({
      ...state,
      loading: false,
      properties: payload
    })
  },
  defaultState
);
