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

  type Replacement {
    id: ID
    in: Skater
    out: Skater
  }

  type Roshambo {
    id: ID
    round: Int
    move: String
  }

  type Trick {
    id: ID
    name: String
    variation: String
    spin: Int
    flip: Int
    shuv: Int
    other: Boolean
  }

  type Attempt {
    id: ID
    successful: Boolean
    offense: Boolean
    redos: Int
    trick: Trick
  }

  type Game {
    id: ID
    round: Int
    date: String
    video_id: String
    event: Event
    skaters: [Skater]
    replacements: [Replacement]
    roshambos: [Roshambo]
    attempts: [Attempt]
  }

  type Event {
    id: ID
    name: String
    image: String
    games: [Game]
  }

  type Query {
    events: [Event]
    games(offset: Int): [Game]
  }
`;
