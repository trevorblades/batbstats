import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Trick {
    attempts: [Attempt]
  }

  extend type Game {
    attempts: [Attempt]
  }

  extend type Skater {
    attempts: [Attempt]
  }

  type Attempt {
    id: ID
    successful: Boolean
    offense: Boolean
    redos: Int
    skaterId: String
  }
`;

function attempts(parent) {
  return parent.getAttempts();
}

export const resolvers = {
  Trick: {attempts},
  Game: {attempts},
  Skater: {attempts}
};
