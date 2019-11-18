export function getInitialLetters(ids) {
  return ids.reduce(
    (acc, id) => ({
      ...acc,
      [id]: 0
    }),
    {}
  );
}

export function getLetters(attempts) {
  if (!attempts.length) {
    return {};
  }

  const ids = new Set([attempts[0].skaterId]);
  for (let i = 0; i < attempts.length; i++) {
    ids.add(attempts[i].skaterId);
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
      letters[attempt.skaterId]++;
    }
  });

  return letters;
}

export function getBye(replacements) {
  for (let i = 0; i < replacements.length; i++) {
    // the heuristic for determining a bye is if the game has a replacement
    // where the value of inId is NULL
    const replacement = replacements[i];
    if (replacement.inId === null) {
      return replacement.outId;
    }
  }

  return null;
}

export function formatRound(round) {
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