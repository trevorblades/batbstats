import CreateGameButton from '../../../components/CreateGameButton';
import EventSelect from '../../../components/EventSelect';
import GamesList from '../../../components/GamesList';
import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {GET_EVENT} from '../../../utils';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';

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
        <CreateGameButton eventId={event.id} />
      </Header>
      <GamesList games={event.games} />
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
