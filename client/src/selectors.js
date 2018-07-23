import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {getLetters} from './util/game';

const getGames = state => state.games.data;
export const getSkaters = createSelector(getGames, games => {
  const skaters = uniqBy(flatMap(games, 'skaters'), 'id');
  return skaters.map(skater => {
    const filteredGames = games.filter(game =>
      some(game.skaters, ['id', skater.id])
    );
    return {
      ...skater,
      games: filteredGames,
      wins: filteredGames.filter(game => {
        const letters = getLetters(game);
        return letters[skater.id] < 5;
      }).length
    };
  });
});
