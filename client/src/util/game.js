import fromPairs from 'lodash/fromPairs';
import map from 'lodash/map';
import {
  ROSHAMBO_MOVE_PAPER,
  ROSHAMBO_MOVE_ROCK,
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

export function getInitialLetters(ids) {
  return fromPairs(ids.map(id => [id, 0]));
}

export function getLetters(attempts, skaters) {
  let trick;
  const skaterIds = map(skaters, 'id');
  const letters = getInitialLetters(skaterIds);
  attempts.forEach(attempt => {
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

export function getBye(replacements) {
  for (let i = 0; i < replacements.length; i++) {
    // the heuristic for determining a bye is if the game has a replacement
    // where the value of in_id is NULL
    const replacement = replacements[i];
    if (replacement.in_id === null) {
      return replacement.out_id;
    }
  }

  return null;
}
