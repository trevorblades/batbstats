export function getInitialLetters(skaters) {
  return skaters.reduce(
    (acc, skater) => ({
      ...acc,
      [skater.id]: 0
    }),
    {}
  );
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
