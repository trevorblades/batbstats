import {gql} from 'apollo-server';

export default gql`
  type Skater {
    id: ID
    first_name: String
    last_name: String
    full_name: String
    stance: String
    birth_date: String
    country: String
  }

  type Trick {
    id: ID
    name: String
  }

  type Attempt {
    id: ID
    trick: Trick
  }

  type Game {
    id: ID
    round: Int
    date: String
    video_id: String
    skaters: [Skater]
    attempts: [Attempt]
  }

  type Query {
    games(offset: Int): [Game]
  }
`;
