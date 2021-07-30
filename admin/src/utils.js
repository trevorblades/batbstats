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
