import isEqual from 'lodash/isEqual';
import pick from 'lodash/fp/pick';

export function createIsEqualWithKeys(...keys) {
  const pickKeys = pick(keys);
  return (a, b) => isEqual(...[a, b].map(pickKeys));
}
