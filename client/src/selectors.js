import differenceInYears from 'date-fns/differenceInYears';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import some from 'lodash/some';
import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {getLetters} from './util/game';

const getGames = state => state.games.data;
const getAttempts = createSelector(getGames, games =>
  flatMap(games, 'attempts')
);

export const getSkaters = createSelector(
  getGames,
  getAttempts,
  (games, attempts) => {
    const now = Date.now();
    const skaters = uniqBy(flatMap(games, 'skaters'), 'id');
    return skaters.map(skater => {
      const filteredGames = games.filter(game =>
        some(game.skaters, ['id', skater.id])
      );

      const wins = filteredGames.filter(game => {
        const letters = getLetters(game);
        return letters[skater.id] < 5;
      }).length;

      const filteredAttempts = filter(attempts, ['skater_id', skater.id]);
      const makes = filter(filteredAttempts, 'successful').length;
      return {
        ...skater,
        age: skater.birth_date && differenceInYears(now, skater.birth_date),
        games: filteredGames,
        wins,
        losses: filteredGames.length - wins,
        attempts: filteredAttempts,
        makes,
        misses: filteredAttempts.length - makes,
        redos: sumBy(filteredAttempts, 'redos')
      };
    });
  }
);

export const getTrickTypes = createSelector(getAttempts, attempts => [
  {
    id: 'kickflip',
    label: 'kickflip',
    value: attempts.filter(attempt => attempt.trick.flip > 0).length
  },
  {
    id: 'heelflip',
    label: 'heelflip',
    value: attempts.filter(attempt => attempt.trick.flip < 0).length
  }
]);
