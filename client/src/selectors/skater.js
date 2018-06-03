import differenceInYears from 'date-fns/differenceInYears';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import map from 'lodash/map';
import sumBy from 'lodash/sumBy';
import {createSelector} from 'reselect';
import {getLetters} from '../util/game';

const getSkater = state => state.skater.properties;
export const getAge = createSelector(
  getSkater,
  skater =>
    skater.birth_date && differenceInYears(Date.now(), skater.birth_date)
);

export const getGames = createSelector(getSkater, skater =>
  skater.games.map(game => ({
    ...game,
    letters: getLetters(game)
  }))
);

export const getWins = createSelector(getGames, getSkater, (games, skater) =>
  games.filter(game => game.letters[skater.id] !== 5)
);

export const getAttempts = createSelector(getGames, games =>
  flatMap(games, 'attempts')
);

export const getSuccessRate = createSelector(getAttempts, attempts => {
  const attemptCount = attempts.length;
  if (!attemptCount) {
    return 0;
  }

  const successfulAttempts = filter(attempts, 'successful');
  return successfulAttempts.length / attemptCount;
});

export const getRedos = createSelector(getAttempts, attempts =>
  sumBy(attempts, 'redos')
);

const getOffensiveAttempts = createSelector(getAttempts, attempts =>
  filter(attempts, 'offense')
);

export const getOffensivePercent = createSelector(
  getAttempts,
  getOffensiveAttempts,
  (attempts, offensiveAttempts) => {
    const attemptCount = attempts.length;
    if (!attemptCount) {
      return 0;
    }

    return offensiveAttempts.length / attemptCount;
  }
);

const getOffensiveTricks = createSelector(
  getOffensiveAttempts,
  offensiveAttempts => map(offensiveAttempts, 'trick')
);

export const getFlipPercent = createSelector(getOffensiveTricks, tricks => {
  const trickCount = tricks.length;
  if (!trickCount) {
    return 0;
  }

  const totalFlip = tricks.reduce(
    (score, {flip}) => (flip ? score + (flip > 0 ? 1 : -1) : score),
    0
  );
  return totalFlip / trickCount;
});
