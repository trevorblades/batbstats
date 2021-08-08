import Bracket, {createBracket} from '../components/Bracket';
import EventSelect from '../components/EventSelect';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {Box, Flex, Heading, Link, Text} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {getEventMetadata} from '../utils';

export default function Event({data}) {
  const {event, events} = data.batbstats;

  const {rounds, numRounds, totalGames} = getEventMetadata(event.games);

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
