import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import groupBy from 'lodash/groupBy';
import pluralize from 'pluralize';
import some from 'lodash/some';
import sumBy from 'lodash/sumBy';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {getLetters} from './util/game';

const getGames = state => state.games.data;
const getAttempts = createSelector(getGames, games =>
  flatMap(games, game =>
    game.attempts.map(attempt => ({
      ...attempt,
      event_id: game.event_id
    }))
  )
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

const getTrickAttempts = createSelector(getAttempts, attempts =>
  countBy(attempts, 'trick.id')
);

export const getTricks = createSelector(
  getAttempts,
  getTrickAttempts,
  (attempts, trickAttempts) =>
    uniqBy(flatMap(attempts, 'trick'), 'id').map(trick => ({
      ...trick,
      attempts: pluralize('attempt', trickAttempts[trick.id], true)
    }))
);

function toPieData(iteratee) {
  return attempts => {
    const counts = countBy(attempts, iteratee);
    return Object.keys(counts).map(key => ({
      id: key,
      label: key,
      value: counts[key]
    }));
  };
}

function getFlipFromAttempt(attempt) {
  const {flip} = attempt.trick;
  if (!flip) {
    return 'none';
  }

  return flip > 0 ? 'kickflip' : 'heelflip';
}

function getSpinFromAttempt(attempt) {
  const {spin} = attempt.trick;
  if (!spin) {
    return 'none';
  }

  return spin > 0 ? 'backside' : 'frontside';
}

function getVariationFromAttempt(attempt) {
  return attempt.trick.variation || 'none';
}

export const getFlipsPieData = createSelector(
  getAttempts,
  toPieData(getFlipFromAttempt)
);

export const getSpinsPieData = createSelector(
  getAttempts,
  toPieData(getSpinFromAttempt)
);

export const getVariationsPieData = createSelector(
  getAttempts,
  toPieData(getVariationFromAttempt)
);

function toLineData(iteratee) {
  return attempts => {
    const groups = groupBy(attempts, iteratee);
    return Object.keys(groups).map(key => {
      const counts = countBy(groups[key], 'event_id');
      return {
        id: key,
        data: Object.keys(counts).map(key => ({
          x: key,
          y: counts[key]
        }))
      };
    });
  };
}

export const getVariationsLineData = createSelector(
  getAttempts,
  toLineData(getVariationFromAttempt)
);

export const getFlipsLineData = createSelector(
  getAttempts,
  toLineData(getFlipFromAttempt)
);

export const getSpinsLineData = createSelector(
  getAttempts,
  toLineData(getSpinFromAttempt)
);
