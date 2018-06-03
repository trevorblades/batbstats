import eq from 'lodash/eq';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import values from 'lodash/values';
import {createSelector} from 'reselect';
import {ROSHAMBO_COUNTERS} from '../../../api/common';
import {getFullName} from '../util/skater';

const getGame = state => state.game.properties;
export const getRoshamboRounds = createSelector(getGame, game => {
  const rounds = values(groupBy(game.roshambos, 'round'));
  rounds.forEach(round => {
    const moves = map(round, 'move');
    if (eq(moves)) {
      return;
    }

    const loserIndex = Number(ROSHAMBO_COUNTERS[moves[1]] === moves[0]);
    round[loserIndex].loser = true;
  });

  return rounds;
});

export const getTitle = createSelector(getGame, game =>
  map(game.skaters, getFullName).join(' vs. ')
);
