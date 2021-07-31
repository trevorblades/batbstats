import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {EVENT_FRAGMENT, getRoundName} from '../../../utils';
import {Flex, Heading} from '@chakra-ui/layout';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {gql, useQuery} from '@apollo/client';
import {groupBy} from 'lodash';

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

export default function EditEvent({params}) {
  const {data, loading, error} = useQuery(GET_EVENT, {
    variables: {id: params.id}
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data.event) {
    return <div>Event not found</div>;
  }

  const rounds = groupBy(data.event.games, 'round');
  return (
    <div>
      <Helmet title={data.event.name} />
      <Header title={data.event.name} />
      <Flex>
        {Object.entries(rounds).map(([round, games]) => (
          <div key={round}>
            <Heading>{getRoundName(round)}</Heading>
            {games.map(game => (
              <div key={game.id}>
                <GatsbyLink to={`/games/${game.id}/edit`}>
                  {game.skaters.map(skater => skater.fullName).join(' vs. ')}
                </GatsbyLink>
              </div>
            ))}
          </div>
        ))}
      </Flex>
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
