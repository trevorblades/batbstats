import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';

const getGames = state => state.games.data;
export const getSkaters = createSelector(getGames, games => {
  const skaters = uniqBy(flatMap(games, 'skaters'), 'id');
  return skaters.map(skater => ({
    ...skater,
    games: games.filter(game => some(game.skaters, ['id', skater.id]))
  }));
});
