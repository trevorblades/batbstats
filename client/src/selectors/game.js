import eq from 'lodash/eq';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import values from 'lodash/values';
import {createSelector} from 'reselect';
import {ROSHAMBO_COUNTERS} from '../../../api/common';
import {getFullName} from '../util/skater';

const getGame = state => state.game.properties;
export const getRoshamboRounds = createSelector(getGame, game => {
  const rounds = values(groupBy(game.roshambos, 'round'));
  const skaterIds = map(game.skaters, 'id');
  return rounds.map(round =>
    sortBy(round, roshambo => skaterIds.indexOf(roshambo.skater_id))
  );
});

export const getRoshamboWinner = createSelector(getRoshamboRounds, rounds => {
  for (let i = 0; i < rounds.length; i++) {
    const round = rounds[i];
    const moves = map(round, 'move');
    if (eq(...moves)) {
      continue;
    }

    const winnerIndex = Number(ROSHAMBO_COUNTERS[moves[0]] === moves[1]);
    return round[winnerIndex].skater_id;
  }
});

export const getTitle = createSelector(getGame, game =>
  map(game.skaters, getFullName).join(' vs. ')
);
