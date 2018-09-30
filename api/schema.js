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
    games: [Game]
  }

  type Replacement {
    id: ID
    in_id: ID
    out_id: ID
  }

  type Roshambo {
    id: ID
    round: Int
    move: String
    skater_id: ID
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
    skater_id: ID
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
    event(id: ID): Event
    events: [Event]
    game(id: ID): Game
    skaters: [Skater]
  }
`;
