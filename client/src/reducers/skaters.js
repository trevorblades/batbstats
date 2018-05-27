import {loop, Cmd} from 'redux-loop';
import {handleActions} from 'redux-actions';
import api from '../api';
import {load, success, failure} from '../actions/skaters';

async function fetchSkaters() {
  const response = await api.get('/skaters');
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

const defaultState = {
  loading: false,
  error: null,
  items: []
};

export default handleActions(
  {
    [load]: state =>
      loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(fetchSkaters, {
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
      items: payload
    })
  },
  defaultState
);
