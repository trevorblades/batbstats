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
    event {
      id
      name
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

export function getRoundName(round) {
  // TODO: rework to accept a number of rounds and calculate the round name
  // based on that instead of a hardcoded number => string relationship
  switch (round.toString()) {
    case '6':
      return 'Championship Battle';
    case '5':
      return 'Third Place Battle';
    case '4':
      return 'Semifinal';
    case '3':
      return 'Quarterfinal';
    default:
      return `Round ${round}`;
  }
}

export function getGameTitle(game) {
  return `${game.event.name}: ${getRoundName(game.round)}`;
}

export function getVersus(skaters) {
  return skaters.map(skater => skater.fullName).join(' vs. ');
}

export function groupByRound(games) {
  return games.reduce((acc, game) => {
    const existing = acc[game.round];
    return {
      ...acc,
      [game.round]: existing ? [...existing, game] : [game]
    };
  }, {});
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
