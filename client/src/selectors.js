import countBy from 'lodash/fp/countBy';
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

const getTrickAttempts = createSelector(getAttempts, countBy('trick.id'));
export const getTricks = createSelector(
  getAttempts,
  getTrickAttempts,
  (attempts, trickAttempts) =>
    uniqBy(flatMap(attempts, 'trick'), 'id').map(trick => ({
      ...trick,
      attempts: trickAttempts[trick.id]
    }))
);

const getFlips = createSelector(
  getAttempts,
  countBy(attempt => {
    const {flip} = attempt.trick;
    if (!flip) {
      return 'none';
    }

    return flip > 0 ? 'kickflip' : 'heelflip';
  })
);

const getSpins = createSelector(
  getAttempts,
  countBy(attempt => {
    const {spin} = attempt.trick;
    if (!spin) {
      return 'none';
    }

    return spin > 0 ? 'backside' : 'frontside';
  })
);

const getVariations = createSelector(
  getAttempts,
  countBy(attempt => attempt.trick.variation || 'regular')
);

function toPieData(object) {
  return Object.keys(object).map(key => ({
    id: key,
    label: key,
    value: object[key]
  }));
}

export const getFlipsPieData = createSelector(getFlips, toPieData);
export const getSpinsPieData = createSelector(getSpins, toPieData);
export const getVariationsPieData = createSelector(getVariations, toPieData);
