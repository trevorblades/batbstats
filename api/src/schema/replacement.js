import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Game {
    replacements: [Replacement]
  }

  type Replacement {
    id: ID
    inId: String
    outId: String
  }
`;

export const resolvers = {
  Game: {
    replacements(parent) {
      return parent.getReplacements();
    }
  }
};
