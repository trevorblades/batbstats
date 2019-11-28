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

module.exports = getBye;
