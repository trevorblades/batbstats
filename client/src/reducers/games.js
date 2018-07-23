import api from '../api';
import {loop, Cmd} from 'redux-loop';
import {handleActions} from 'redux-actions';
import {load, success, failure} from '../actions/games';

async function fetchData() {
  const response = await api.get('/games');
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

const defaultState = {
  loading: false,
  error: null,
  data: []
};

export default handleActions(
  {
    [load]: state =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(fetchData, {
          successActionCreator: success,
          failActionCreator: failure
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
      data: payload
    })
  },
  defaultState
);
