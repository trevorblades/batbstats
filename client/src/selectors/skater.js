import differenceInYears from 'date-fns/differenceInYears';
import flatMap from 'lodash/flatMap';
import {createSelector} from 'reselect';

const getSkater = state => state.skater.properties;
export const getAge = createSelector(getSkater, skater =>
  differenceInYears(Date.now(), skater.birth_date)
);

export const getAttempts = createSelector(getSkater, skater =>
  flatMap(skater.games, 'attempts')
);
