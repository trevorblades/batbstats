import Bracket, {createBracket} from '../components/Bracket';
import EventSelect from '../components/EventSelect';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {Box, Flex, Heading, Link, Text} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {groupByRound} from '../utils';

export default function Event({data}) {
  const {event, events} = data.batbstats;

  const rounds = groupByRound(event.games);

  // number of rounds is x in the expression "n = 2^x" where n is the number of
  // games in the first round. so i needed to learn how to solve for exponents
  // https://www.calculatorsoup.com/calculators/algebra/exponentsolve.php
  const firstRound = rounds[1].length;

  // learned about log2. it's the same as doing log(x) / log(2)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2
  const numRounds = firstRound === 1 ? 2 : Math.ceil(Math.log2(firstRound)) + 1;

  // summing a geometric sequence
  // https://www.mathsisfun.com/algebra/sequences-sums-geometric.html
  const totalGames = (1 - Math.pow(2, numRounds)) / (1 - 2);

  return (
    <Flex direction="column" h="100vh">
      <Helmet title={event.name} />
      <Header title={event.name}>
        <EventSelect event={event} events={events} />
        <Link ml="3" as={GatsbyLink} to="/events">
          All events
        </Link>
      </Header>
      {event.games.length < totalGames ? (
        <Box p={5}>
          <Heading>Event not complete</Heading>
          <Text>We&apos;re working on it...</Text>
        </Box>
      ) : (
        <ScrollContainer hideScrollbars={false}>
          <Box display="inline-block" mx={5}>
            <Bracket
              game={createBracket(rounds[numRounds], numRounds, rounds)[0]}
            />
          </Box>
        </ScrollContainer>
      )}
    </Flex>
  );
}

Event.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query GetEvent($id: ID!) {
    batbstats {
      events {
        id
        name
      }
      event(id: $id) {
        id
        name
        games {
          id
          round
          skaters {
            id
            fullName
          }
          replacements {
            in {
              id
              fullName
            }
            out {
              id
              fullName
            }
          }
          result {
            winner {
              id
            }
            lettersAgainst
          }
        }
      }
    }
  }
`;
