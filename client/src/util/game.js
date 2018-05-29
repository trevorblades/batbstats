import eq from 'lodash/eq';
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

export function getResults(game) {
  let attacker;
  let defender;
  const rounds = values(groupBy(game.roshambos, 'round'));

  // First, we loop through the roshambo rounds to see who sets first
  rounds.forEach(round => {
    const moves = map(round, 'move');
    if (eq(moves)) {
      return;
    }

    const attackerIndex = counters[moves[0]] === moves[1] ? 1 : 0;
    attacker = round[attackerIndex].skater_id;
    defender = round[attackerIndex ? 0 : 1].skater_id;
  });

  let index = 0;
  let playing = true;
  const letters = {
    [attacker]: 0,
    [defender]: 0
  };

  const attempts = groupBy(game.attempts, 'skater_id');
  while (playing) {
    const offense = attempts[attacker][index];
    if (offense.successful) {
      const defense = attempts[defender][index];
      if (!defense.successful) {
        letters[defender]++;
        if (letters[defender] === 5) {
          playing = false;
        }
      }

      index++;
      continue;
    }

    const nextAttacker = defender;
    defender = attacker;
    attacker = nextAttacker;

    index++;
    if (!attempts[attacker][index]) {
      playing = false;
    }
  }

  return game.skaters.map(skater => ({
    ...skater,
    letters: letters[skater.id]
  }));
}
