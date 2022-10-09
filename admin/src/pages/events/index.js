import Header from '../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Heading, SimpleGrid} from '@chakra-ui/layout';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {useCardProps} from '../../utils';

export default function Events({data}) {
  const cardProps = useCardProps();
  return (
    <>
      <Helmet title="Events" />
      <Header>All events</Header>
      <SimpleGrid minChildWidth={300} spacing={5} p={5}>
        {data.batbstats.events.map(event => (
          <Box
            {...cardProps}
            key={event.id}
            borderWidth="1px"
            rounded="md"
            p={4}
            as={GatsbyLink}
            to={'/events/' + event.id}
          >
            <Heading size="lg">{event.name}</Heading>
          </Box>
        ))}
      </SimpleGrid>
    </>
  );
}

Events.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query ListEvents {
    batbstats {
      events {
        id
        name
      }
    }
  }
`;
