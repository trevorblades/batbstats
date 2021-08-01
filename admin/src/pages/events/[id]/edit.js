import GamesList from '../../../components/GamesList';
import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {AddIcon} from '@chakra-ui/icons';
import {Button, Select} from '@chakra-ui/react';
import {EVENT_FRAGMENT} from '../../../utils';
import {Helmet} from 'react-helmet';
import {gql, useQuery} from '@apollo/client';
import {navigate} from 'gatsby';

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFragment
    }
    events {
      id
      name
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

  const {id, name, games} = data.event;
  return (
    <div>
      <Helmet title={name} />
      <Header>
        <Select
          w="auto"
          size="sm"
          fontSize="md"
          value={id}
          rounded="md"
          onChange={event => navigate(`/events/${event.target.value}/edit`)}
        >
          {data.events.map(event => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </Select>
        <Button leftIcon={<AddIcon />} colorScheme="green" size="sm" ml="auto">
          New game
        </Button>
      </Header>
      <GamesList games={games} />
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
