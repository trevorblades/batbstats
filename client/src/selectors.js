import countBy from 'lodash/countBy';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import reject from 'lodash/reject';
import round from 'lodash/round';
import some from 'lodash/some';
import sortBy from 'lodash/sortBy';
import sumBy from 'lodash/sumBy';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import {createSelector} from 'reselect';
import {getLetters, getRoundName, getRounds} from './util/game';
import {getShortName, getEventsFromGames} from './util/event';

export const getGames = createSelector(
  state => state.games.data,
  games =>
    games.map(game => {
      const {event} = game;
      const letters = getLetters(game);
      const rounds = getRounds(game);
      const runs = rounds.reduce(
        (runs, round) =>
          filter(round).length > 1
            ? [...runs.slice(0, -1), runs[runs.length - 1] + 1]
            : [...filter(runs), 0],
        [0]
      );

      let bye = null;
      for (let i = 0; i < game.replacements.length; i++) {
        // the heuristic for determining a bye is if the game has a replacement
        // where the value of in_id is NULL
        const replacement = game.replacements[i];
        if (replacement.in_id === null) {
          bye = replacement.out_id;
          break;
        }
      }

      return {
        ...game,
        letters,
        round_name: getRoundName(game.round),
        rounds,
        runs,
        bye,
        event: {
          ...event,
          short_name: getShortName(event)
        }
      };
    })
);

function getAverage(key) {
  return games => round(sumBy(games, key) / games.length, 2);
}

export const getAverageRounds = createSelector(
  getGames,
  getAverage('rounds.length')
);

export const getAverageRuns = createSelector(
  getGames,
  getAverage('runs.length')
);

const getAttempts = createSelector(getGames, games =>
  flatMap(games, game => {
    const skaters = keyBy(game.skaters, 'id');
    return game.attempts.map(attempt => ({
      ...attempt,
      skater: skaters[attempt.skater_id],
      event_id: game.event_id
    }));
  })
);

export const getSkaters = createSelector(
  getGames,
  getAttempts,
  (games, attempts) => {
    const skaters = uniqBy(flatMap(games, 'skaters'), 'id');
    return skaters.map(skater => {
      const skaterGames = games
        .filter(game => some(game.skaters, ['id', skater.id]))
        .map(game => ({
          ...game,
          win: game.letters[skater.id] < 5
        }));

      const wins = filter(skaterGames, 'win').length;
      const skaterAttempts = filter(attempts, ['skater_id', skater.id]);
      const makes = filter(skaterAttempts, 'successful').length;
      const gamesPlayed = skaterGames.length;
      return {
        ...skater,
        games: sortBy(skaterGames, ['event_id', 'round']),
        wins,
        losses: gamesPlayed - wins,
        win_percentage: round(wins / gamesPlayed * 100, 2),
        attempts: skaterAttempts,
        makes,
        misses: skaterAttempts.length - makes,
        redos: sumBy(skaterAttempts, 'redos'),
        letters_for: sumBy(skaterGames, game => {
          const opponent = Object.keys(game.letters).filter(
            key => parseInt(key) !== skater.id
          )[0];
          return game.letters[opponent];
        }),
        letters_against: sumBy(skaterGames, `letters[${skater.id}]`)
      };
    });
  }
);

function getSuccessRate(attempts) {
  const rate =
    attempts.length && filter(attempts, 'successful').length / attempts.length;
  return round(rate * 100, 2);
}

export const getTricks = createSelector(getAttempts, attempts => {
  const groups = groupBy(attempts, 'trick.id');
  return uniqBy(flatMap(attempts, 'trick'), 'id').map(trick => {
    const group = groups[trick.id];
    return {
      ...trick,
      name_with_icon:
        !trick.variation &&
        !trick.flip &&
        !trick.shuv &&
        !trick.spin &&
        !trick.other
          ? `⚠️ ${trick.name}`
          : trick.name,
      attempts: group.length,
      offense_success_rate: getSuccessRate(filter(group, 'offense')),
      defense_success_rate: getSuccessRate(reject(group, 'offense'))
    };
  });
});

function toPieData(iteratee) {
  return attempts => {
    const counts = countBy(attempts, iteratee);
    return Object.keys(counts)
      .sort()
      .map(key => ({
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

const getStance = state => state.settings.stance;
const getResult = state => state.settings.result;
const getPosture = state => state.settings.posture;
const getFilteredAttempts = createSelector(
  getAttempts,
  getStance,
  getResult,
  getPosture,
  (attempts, stance, result, posture) =>
    attempts.filter(
      attempt =>
        (stance === 'both' || attempt.skater.stance === stance) &&
        (result === 'both' || attempt.successful === (result === 'miss')) &&
        (posture === 'both' || attempt.offense === (posture === 'offense'))
    )
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
    const eventIds = uniq(map(attempts, 'event_id')).sort();
    const data = Object.keys(groups)
      .sort()
      .map(key => {
        const counts = groupBy(groups[key], 'event_id');
        return {
          id: key,
          data: eventIds.map(eventId => ({
            x: eventId,
            y: counts[eventId] ? counts[eventId].length : 0
          }))
        };
      });

    return sortBy(data, 'id');
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

export const getEvents = createSelector(getGames, getEventsFromGames);
