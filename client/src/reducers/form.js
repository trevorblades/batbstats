import api from '../api';
import {Cmd, loop} from 'redux-loop';
import {failure, submit, success} from '../actions/form';
import {getFormId} from '../util/form';
import {handleActions} from 'redux-actions';

async function createRequest(method, action, body) {
  const response = await api[method](action, {body});
  if (response.err) {
    throw response.body;
  }
  return response.body;
}

export default handleActions(
  {
    [submit]: (state, {payload}) => {
      const id = getFormId(payload.method, payload.action);
      return loop(
        {
          ...state,
          [id]: {
            loading: true,
            error: null
          }
        },
        Cmd.run(createRequest, {
          successActionCreator: body =>
            success({
              id,
              body,
              successActionCreator: payload.successActionCreator
            }),
          failActionCreator: error =>
            failure({
              id,
              error
            }),
          args: [payload.method, payload.action, payload.body]
        })
      );
    },
    [success]: (state, {payload}) =>
      loop(
        {
          ...state,
          [payload.id]: null
        },
        Cmd.action(payload.successActionCreator(payload.body))
      ),
    [failure]: (state, {payload}) => ({
      ...state,
      [payload.id]: {
        loading: false,
        error: payload.error
      }
    })
  },
  {}
);
