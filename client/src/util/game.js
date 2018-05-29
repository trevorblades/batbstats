import eq from 'lodash/eq';
import fromPairs from 'lodash/fromPairs';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import values from 'lodash/values';
import {
  ROSHAMBO_MOVE_ROCK,
  ROSHAMBO_MOVE_PAPER,
  ROSHAMBO_MOVE_SCISSORS
} from '../../../common';

const counters = {
  [ROSHAMBO_MOVE_ROCK]: ROSHAMBO_MOVE_PAPER,
  [ROSHAMBO_MOVE_PAPER]: ROSHAMBO_MOVE_SCISSORS,
  [ROSHAMBO_MOVE_SCISSORS]: ROSHAMBO_MOVE_ROCK
};

export function getRoshamboWinner(game) {
  const rounds = values(groupBy(game.roshambos, 'round'));
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const moves = map(round, 'move');
    if (eq(moves)) {
      continue;
    }

    return round[counters[moves[0]] === moves[1] ? 1 : 0].skater_id;
  }
}

export function getLetters(game) {
  let trick;
  const letters = fromPairs(game.skaters.map(skater => [skater.id, 0]));
  game.attempts.forEach(attempt => {
    if (!trick) {
      if (attempt.successful) {
        trick = attempt;
      }
      return;
    }

    if (attempt.offense) {
      if (attempt.successful) {
        trick = attempt;
      }
      return;
    }

    if (!attempt.successful) {
      letters[attempt.skater_id]++;
    }
  });

  return letters;
}
