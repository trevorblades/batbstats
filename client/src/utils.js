const decode = require('jwt-decode');

function getInitialLetters(skaters) {
  return skaters.reduce(
    (acc, skater) => ({
      ...acc,
      [skater.id]: 0
    }),
    {}
  );
}

function formatRound(round) {
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

function getBye(replacements) {
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

function userFromToken(token) {
  try {
    const user = decode(token);
    return {
      ...user,
      __typename: 'User'
    };
  } catch (error) {
    return null;
  }
}

exports.getInitialLetters = getInitialLetters;
exports.formatRound = formatRound;
exports.getBye = getBye;
exports.userFromToken = userFromToken;
