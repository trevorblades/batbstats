import differenceInYears from 'date-fns/differenceInYears';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
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
  return successfulAttempts.length / attempts.length;
});
