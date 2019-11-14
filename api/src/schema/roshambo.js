import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Game {
    roshambos: [Roshambo]
  }

  type Roshambo {
    id: ID
    round: Int
    move: String
    skaterId: String
  }
`;

export const resolvers = {
  Game: {
    roshambos(parent) {
      return parent.getRoshambos();
    }
  }
};
