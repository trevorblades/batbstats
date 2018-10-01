import fromPairs from 'lodash/fromPairs';
import sum from 'lodash/sum';
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

export function getLetters(attempts) {
  if (!attempts.length) {
    return {};
  }

  const ids = new Set([attempts[0].skater_id]);
  for (let i = 0; i < attempts.length; i++) {
    ids.add(attempts[i].skater_id);
    if (ids.size > 1) {
      break;
    }
  }

  let trick;
  const letters = getInitialLetters(Array.from(ids));
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

export function getAggregates(games, id) {
  let lettersFor = 0;
  let lettersAgainst = 0;
  const wins = games.reduce((count, game) => {
    const bye = getBye(game.replacements);
    if (!bye) {
      const letters = getLetters(game.attempts);
      const totalLetters = sum(Object.values(letters));
      lettersAgainst += letters[id];
      if (letters[id] < 5) {
        lettersFor += 5;
        return count + 1;
      }

      lettersFor += totalLetters - 5;
    }

    return count;
  }, 0);

  return {
    wins,
    plusMinus: lettersFor - lettersAgainst
  };
}
