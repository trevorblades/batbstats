import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import {createSelector} from 'reselect';
import {getFullName} from '../util/skater';

const getGame = state => state.game.properties;
export const getRoshambos = createSelector(getGame, game =>
  groupBy(game.roshambos, 'skater_id')
);

export const getAttempts = createSelector(getGame, game =>
  groupBy(game.attempts, 'skater_id')
);

export const getTitle = createSelector(getGame, game =>
  map(game.skaters, getFullName).join(' vs. ')
);
