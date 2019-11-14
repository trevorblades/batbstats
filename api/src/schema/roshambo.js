import {MOVES} from '../utils';
import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Game {
    roshambos: [Roshambo]
  }

  enum Move {
    ${MOVES.join(' ')}
  }

  type Roshambo {
    id: ID
    round: Int
    move: Move
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
