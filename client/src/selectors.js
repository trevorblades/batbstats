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

export const getTricks = createSelector(getAttempts, attempts => {
  const attemptCounts = countBy(attempts, 'trick.id');
  return uniqBy(flatMap(attempts, 'trick'), 'id').map(trick => ({
    ...trick,
    attempts: pluralize('attempt', attemptCounts[trick.id], true)
  }));
});

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

const getIncludeMisses = state => state.settings.includeMisses;
const getFilteredAttempts = createSelector(
  getAttempts,
  getIncludeMisses,
  (attempts, includeMisses) =>
    includeMisses ? attempts : filter(attempts, 'successful')
);

export const getFlipsPieData = createSelector(
  getFilteredAttempts,
  toPieData(getFlipFromAttempt)
);

export const getSpinsPieData = createSelector(
  getFilteredAttempts,
  toPieData(getSpinFromAttempt)
);

export const getVariationsPieData = createSelector(
  getFilteredAttempts,
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
  getFilteredAttempts,
  toLineData(getVariationFromAttempt)
);

export const getFlipsLineData = createSelector(
  getFilteredAttempts,
  toLineData(getFlipFromAttempt)
);

export const getSpinsLineData = createSelector(
  getFilteredAttempts,
  toLineData(getSpinFromAttempt)
);
