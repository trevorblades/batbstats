import {Event} from '../db';
import {gql} from 'apollo-server';

export const typeDef = gql`
  extend type Query {
    events: [Event]
    event(id: ID!): Event
  }

  extend type Game {
    event: Event
  }

  type Event {
    id: ID
    name: String
    image: String
  }
`;

export const resolvers = {
  Query: {
    events() {
      return Event.findAll();
    },
    event(parent, args) {
      return Event.findByPk(args.id);
    }
  },
  Game: {
    event(parent) {
      return parent.getEvent();
    }
  }
};
