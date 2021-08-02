import EventSelect from '../../../components/EventSelect';
import GameList from '../../../components/GameList';
import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {AddIcon} from '@chakra-ui/icons';
import {Button} from '@chakra-ui/react';
import {EVENT_FRAGMENT} from '../../../utils';
import {Helmet} from 'react-helmet';
import {gql, useQuery} from '@apollo/client';

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

  const {event, events} = data;
  return (
    <div>
      <Helmet title={event.name} />
      <Header>
        <EventSelect event={event} events={events} path="edit" />
        <Button leftIcon={<AddIcon />} colorScheme="green" size="sm" ml="auto">
          New game
        </Button>
      </Header>
      <GameList games={event.games} />
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
