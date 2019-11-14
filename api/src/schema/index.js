import merge from 'lodash/merge';
import {typeDef as Attempt, resolvers as attemptResolvers} from './attempt';
import {typeDef as Event, resolvers as eventResolvers} from './event';
import {typeDef as Game, resolvers as gameResolvers} from './game';
import {
  typeDef as Replacement,
  resolvers as replacementResolvers
} from './replacement';
import {typeDef as Roshambo, resolvers as roshamboResolvers} from './roshambo';
import {typeDef as Skater, resolvers as skaterResolvers} from './skater';
import {typeDef as Trick, resolvers as trickResolvers} from './trick';
import {gql, makeExecutableSchema} from 'apollo-server';

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    Query,
    Mutation,
    Skater,
    Attempt,
    Event,
    Game,
    Replacement,
    Roshambo,
    Trick
  ],
  resolvers: merge(
    skaterResolvers,
    attemptResolvers,
    eventResolvers,
    gameResolvers,
    replacementResolvers,
    roshamboResolvers,
    trickResolvers
  )
});
