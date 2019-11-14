import {AuthenticationError, UserInputError, gql} from 'apollo-server';
import {Trick} from '../db';

export const typeDef = gql`
  extend type Query {
    tricks: [Trick]
    trick(id: ID!): Trick
  }

  extend type Mutation {
    updateTrick(
      id: ID!
      name: String
      flip: Int
      shuv: Int
      spin: Int
      variation: String # TODO: use enums
      other: Boolean
    ): Trick
  }

  extend type Attempt {
    trick: Trick
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
`;

export const resolvers = {
  Query: {
    tricks() {
      return Trick.findAll();
    },
    trick(parent, args) {
      return Trick.findByPk(args.id);
    }
  },
  Mutation: {
    async updateTrick(parent, {id, ...args}, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const trick = await Trick.findByPk(id);
      if (!trick) {
        throw new UserInputError('Trick not found');
      }

      return trick.update(args);
    }
  },
  Attempt: {
    trick(parent) {
      return parent.getTrick();
    }
  }
};
