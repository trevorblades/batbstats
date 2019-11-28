import decode from 'jwt-decode';
import {gql, useQuery} from '@apollo/client';
import {graphql, useStaticQuery} from 'gatsby';

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

export function userFromToken(token) {
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

export function useTitle() {
  const data = useStaticQuery(
    graphql`
      {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  );

  return data.site.siteMetadata.title;
}

const GET_USER = gql`
  {
    user @client(always: true) {
      email
    }
  }
`;

export function useUser() {
  const {data, client} = useQuery(GET_USER);

  function logOut() {
    localStorage.removeItem('token');
    client.resetStore();
  }

  return {
    user: data && data.user,
    logOut
  };
}
