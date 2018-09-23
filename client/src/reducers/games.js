import api from '../api';
import {Cmd, loop} from 'redux-loop';
import {
  failure,
  load,
  success,
  updateSkater,
  updateTrick
} from '../actions/games';
import {handleActions} from 'redux-actions';

async function fetchData(page = 1) {
  const response = await api.get(`/games?page=${page}`);
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

function createFetchDataCmd(args) {
  return Cmd.run(fetchData, {
    successActionCreator: success,
    failActionCreator: failure,
    args
  });
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
        createFetchDataCmd()
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
        return loop(nextState, createFetchDataCmd([payload.next_page]));
      }

      return {
        ...nextState,
        loading: false
      };
    },
    [updateSkater]: (state, {payload}) => ({
      ...state,
      data: state.data.map(game => ({
        ...game,
        skaters: game.skaters.map(
          skater => (skater.id === payload.id ? payload : skater)
        )
      }))
    }),
    [updateTrick]: (state, {payload}) => ({
      ...state,
      data: state.data.map(game => ({
        ...game,
        attempts: game.attempts.map(attempt => ({
          ...attempt,
          trick: attempt.trick_id === payload.id ? payload : attempt.trick
        }))
      }))
    })
  },
  defaultState
);
