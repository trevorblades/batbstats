import {AuthenticationError, UserInputError, gql} from 'apollo-server';
import {GraphQLDate} from 'graphql-iso-date';
import {Skater} from '../db';

export const typeDef = gql`
  scalar Date

  extend type Query {
    skaters: [Skater]
    skater(id: ID!): Skater
  }

  extend type Mutation {
    updateSkater(
      id: ID!
      firstName: String
      lastName: String
      stance: String
      country: String
      birthDate: String
    ): Skater
  }

  extend type Game {
    skaters: [Skater]
  }

  type Skater {
    id: ID
    firstName: String
    lastName: String
    fullName: String
    stance: String
    birthDate: Date
    country: String
  }
`;

export const resolvers = {
  Date: GraphQLDate,
  Query: {
    skaters() {
      return Skater.findAll();
    },
    skater(parent, args) {
      return Skater.findByPk(args.id);
    }
  },
  Mutation: {
    async updateSkater(parent, {id, ...args}, {user}) {
      if (!user) {
        throw new AuthenticationError('Unauthorized');
      }

      const skater = await Skater.findByPk(id);
      if (!skater) {
        throw new UserInputError('Skater not found');
      }

      return skater.update(args);
    }
  },
  Game: {
    skaters(parent) {
      return parent.getSkaters();
    }
  }
};
