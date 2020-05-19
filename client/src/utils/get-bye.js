function getBye(replacements) {
  for (let i = 0; i < replacements.length; i++) {
    // the heuristic for determining a bye is if the game has a replacement
    // where the value of in is null
    const replacement = replacements[i];
    if (!replacement.in) {
      return replacement.out;
    }
  }

  return null;
}

module.exports = getBye;
