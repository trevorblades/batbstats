import countBy from 'lodash/countBy';
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

function objectToPieData(object) {
  return Object.keys(object).map(key => ({
    id: key,
    label: key,
    value: object[key]
  }));
}

export const getFlips = createSelector(getAttempts, attempts =>
  objectToPieData(
    countBy(attempts, attempt => {
      const {flip} = attempt.trick;
      if (!flip) {
        return 'none';
      }

      return flip > 0 ? 'kickflip' : 'heelflip';
    })
  )
);

export const getSpins = createSelector(getAttempts, attempts =>
  objectToPieData(
    countBy(attempts, attempt => {
      const {spin} = attempt.trick;
      if (!spin) {
        return 'none';
      }

      return spin > 0 ? 'backside' : 'frontside';
    })
  )
);

export const getVariations = createSelector(getAttempts, attempts =>
  objectToPieData(
    countBy(attempts, attempt => attempt.trick.variation || 'regular')
  )
);
