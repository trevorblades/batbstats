import {gql} from '@apollo/client';

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
