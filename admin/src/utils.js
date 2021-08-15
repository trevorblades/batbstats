import {gql} from '@apollo/client';
import {useColorModeValue} from '@chakra-ui/react';

export const SKATE = 'SKATE';

export const SKATER_FRAGMENT = gql`
  fragment SkaterFragment on Skater {
    id
    fullName
  }
`;

export const LIST_SKATERS = gql`
  query ListSkaters {
    skaters {
      ...SkaterFragment
    }
  }
  ${SKATER_FRAGMENT}
`;

export const TRICK_FRAGMENT = gql`
  fragment TrickFragment on Trick {
    id
    name
    variation
  }
`;

export const LIST_TRICKS = gql`
  query ListTricks {
    tricks {
      ...TrickFragment
    }
  }
  ${TRICK_FRAGMENT}
`;

export const GAME_FRAGMENT = gql`
  fragment GameFragment on Game {
    id
    round
    date
    updatedAt
    event {
      id
      name
      # to calculate number of rounds
      games(filter: {round: 1}) {
        round
      }
    }
    skaters {
      id
      fullName
    }
    replacements {
      in {
        id
        fullName
      }
      out {
        id
        fullName
      }
    }
    roshambos {
      id
      round
      move
      skater {
        id
      }
    }
    attempts {
      id
      offense
      successful
      redos
      trick {
        id
        name
      }
      skater {
        id
      }
    }
  }
`;

export const EVENT_FRAGMENT = gql`
  fragment EventFragment on Event {
    id
    name
    games {
      id
      round
      date
      skaters {
        id
        fullName
      }
      replacements {
        in {
          id
          fullName
        }
        out {
          id
          fullName
        }
      }
      result {
        winner {
          id
        }
        lettersAgainst
      }
    }
  }
`;

export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFragment
    }
    events {
      id
      name
    }
  }
  ${EVENT_FRAGMENT}
`;

export function insert(array, index, item) {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

export function getRoundName(round, numRounds) {
  switch (numRounds - round) {
    case -1:
      return 'Third Place Battle';
    case 0:
      return 'Championship Battle';
    case 1:
      return 'Semifinal';
    case 2:
      return 'Quarterfinal';
    default:
      return `Round ${round}`;
  }
}

export function getGameTitle(game, numRounds) {
  return `${game.event.name}: ${getRoundName(game.round, numRounds)}`;
}

export function getVersus(skaters) {
  return skaters.map(skater => skater.fullName).join(' vs. ');
}

export function useCardProps() {
  const bg = useColorModeValue('gray.100', 'gray.700');
  const hoverBg = useColorModeValue('gray.200', 'gray.600');
  return {
    bg,
    transition: 'all 250ms',
    sx: {
      ':hover': {
        bg: hoverBg
      }
    }
  };
}

export function getEventMetadata(event) {
  const rounds = event.games.reduce((acc, game) => {
    const existing = acc[game.round];
    return {
      ...acc,
      [game.round]: existing ? [...existing, game] : [game]
    };
  }, {});

  // number of rounds is x in the expression "n = 2^x" where n is the number of
  // games in the first round. so i needed to learn how to solve for exponents
  // https://www.calculatorsoup.com/calculators/algebra/exponentsolve.php
  const firstRound = rounds[1]?.length;

  // learned about log2. it's the same as doing log(x) / log(2)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2
  const numRounds = firstRound === 1 ? 2 : Math.ceil(Math.log2(firstRound)) + 1;

  // summing a geometric sequence
  // https://www.mathsisfun.com/algebra/sequences-sums-geometric.html
  const totalGames = (1 - Math.pow(2, numRounds)) / (1 - 2);

  return {rounds, numRounds, totalGames};
}

export const ROSHAMBO = {
  rock: {
    emoji: '🪨',
    counter: 'paper'
  },
  paper: {
    emoji: '📄',
    counter: 'scissors'
  },
  scissors: {
    emoji: '✂️',
    counter: 'rock'
  }
};

export function reduceRoshambos(roshambos) {
  // reduce flat array of roshambo rounds into roshambo round format
  // [{[id]: move}]
  return Object.values(
    roshambos.reduce((acc, roshambo) => {
      const existing = acc[roshambo.round];
      const next = {[roshambo.skater.id]: roshambo.move};
      return {
        ...acc,
        [roshambo.round]: existing ? {...existing, ...next} : next
      };
    }, {})
  );
}

// TODO: refactor to get skaterIds from roshambo.skater.id
export function getRoshamboWinner(roshambos, skaterIds) {
  const lastRound = roshambos[roshambos.length - 1];
  const [p1, p2] = skaterIds.map(skaterId => lastRound?.[skaterId]);

  // if the round is incomplete or a tie return null
  const isTied = p1 === p2;
  if (!p1 || !p2 || isTied) {
    return [null, isTied];
  }

  // check to see if p2 is countering p1 and return the appropriate skater id
  return [skaterIds[Number(ROSHAMBO[p1].counter === p2)], false];
}
