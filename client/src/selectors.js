import differenceInYears from 'date-fns/differenceInYears';
import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {getLetters} from './util/game';

const getGames = state => state.games.data;
export const getSkaters = createSelector(getGames, games => {
  const now = Date.now();
  const skaters = uniqBy(flatMap(games, 'skaters'), 'id');
  return skaters.map(skater => {
    const filteredGames = games.filter(game =>
      some(game.skaters, ['id', skater.id])
    );

    const gamesPlayed = filteredGames.length;
    const wins = filteredGames.filter(game => {
      const letters = getLetters(game);
      return letters[skater.id] < 5;
    }).length;

    return {
      ...skater,
      age: skater.birth_date && differenceInYears(now, skater.birth_date),
      games: filteredGames,
      gamesPlayed,
      wins,
      losses: gamesPlayed - wins
    };
  });
});
