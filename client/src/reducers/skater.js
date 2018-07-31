import api from '../api';
import {handleActions} from 'redux-actions';
import {loop, Cmd} from 'redux-loop';
import {save, success, failure, reset} from '../actions/skater';

async function createSkater(body) {
  const response = await api.post('/skaters', {body});
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

async function updateSkater(body, id) {
  const response = await api.put(`/skaters/${id}`, {body});
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

const defaultState = {
  loading: false,
  error: null,
  data: null
};

export default handleActions(
  {
    [save]: (state, {payload}) => {
      const {id, ...body} = payload;
      return loop(
        {
          ...state,
          loading: true
        },
        Cmd.run(id ? updateSkater : createSkater, {
          successActionCreator: success,
          failActionCreator: failure,
          args: [body, id]
        })
      );
    },
    [success]: (state, {payload}) => ({
      ...state,
      loading: false,
      data: payload
    }),
    [failure]: (state, {payload}) => ({
      ...state,
      loading: false,
      error: payload
    }),
    [reset]: () => defaultState
  },
  defaultState
);
