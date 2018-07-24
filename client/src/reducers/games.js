import api from '../api';
import {loop, Cmd} from 'redux-loop';
import {handleActions} from 'redux-actions';
import {load, success, failure} from '../actions/games';

async function fetchData(page = 1) {
  const response = await api.get(`/games?page=${page}`);
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
    [success]: (state, {payload}) => {
      const nextState = {
        ...state,
        data: [...state.data, ...payload.games]
      };

      if (payload.next_page) {
        return loop(
          nextState,
          Cmd.run(fetchData, {
            successActionCreator: success,
            failActionCreator: failure,
            args: [payload.next_page]
          })
        );
      }

      return {
        ...nextState,
        loading: false
      };
    }
  },
  defaultState
);
