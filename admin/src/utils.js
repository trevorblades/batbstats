import {gql} from '@apollo/client';

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
      result {
        winner {
          id
        }
        lettersAgainst
      }
    }
  }
`;

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
