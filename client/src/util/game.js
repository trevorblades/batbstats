import fromPairs from 'lodash/fromPairs';
import {
  ROSHAMBO_MOVE_ROCK,
  ROSHAMBO_MOVE_PAPER,
  ROSHAMBO_MOVE_SCISSORS
} from '../../../api/common';

export function getRoundName(round) {
  switch (round) {
    case 6:
      return 'Championship Battle';
    case 5:
      return 'Third Place Battle';
    case 4:
      return 'Semifinal';
    case 3:
      return 'Quarterfinal';
    default:
      return `Round ${round}`;
  }
}

export function getRoshamboEmoji(move) {
  switch (move) {
    case ROSHAMBO_MOVE_ROCK:
      return '✊';
    case ROSHAMBO_MOVE_PAPER:
      return '✋';
    case ROSHAMBO_MOVE_SCISSORS:
      return '✌️';
    default:
      return null;
  }
}

export function getInitialLetters(skaters) {
  return fromPairs(skaters.map(skater => [skater.id, 0]));
}

export function getLetters(game) {
  let trick;
  const letters = getInitialLetters(game.skaters);
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
