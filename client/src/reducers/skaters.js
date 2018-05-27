export default (state = null, action) => {
  if (action.type === 'SSF') {
    return action.payload;
  }
  return state;
};
