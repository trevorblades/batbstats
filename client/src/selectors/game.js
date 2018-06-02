import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import {createSelector} from 'reselect';
import {getFullName} from '../util/skater';

const getGame = state => state.game.properties;
export const getRoshamboRounds = createSelector(getGame, game => {
  const groups = groupBy(game.roshambos, 'round');
  return Object.keys(groups).map(key => groups[key]);
});

export const getTitle = createSelector(getGame, game =>
  map(game.skaters, getFullName).join(' vs. ')
);
