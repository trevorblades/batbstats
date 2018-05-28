import differenceInYears from 'date-fns/differenceInYears';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import sumBy from 'lodash/sumBy';
import {createSelector} from 'reselect';

const getSkater = state => state.skater.properties;
export const getAge = createSelector(
  getSkater,
  skater =>
    skater.birth_date && differenceInYears(Date.now(), skater.birth_date)
);

export const getAttempts = createSelector(getSkater, skater =>
  flatMap(skater.games, 'attempts')
);

export const getSuccessRate = createSelector(getAttempts, attempts => {
  const successfulAttempts = filter(attempts, 'successful');
  const attemptCount = attempts.length;
  return attemptCount && successfulAttempts.length / attemptCount;
});

export const getRedos = createSelector(getAttempts, attempts =>
  sumBy(attempts, 'redos')
);
