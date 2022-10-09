import CreateGameButton from '../../../components/CreateGameButton';
import EventSelect from '../../../components/EventSelect';
import GamesList from '../../../components/GamesList';
import Header from '../../../components/Header';
import NoSSR from '@mpth/react-no-ssr';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Progress, Text} from '@chakra-ui/react';
import {GET_EVENT, getEventMetadata} from '../../../utils';
import {Helmet} from 'react-helmet';
import {useQuery} from '@apollo/client';

function GetEvent({variables}) {
  const {data, loading, error} = useQuery(GET_EVENT, {variables});

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
  const {rounds, numRounds, totalGames} = getEventMetadata(event);
  const percentComplete = (event.games.length / totalGames) * 100;

  return (
    <div>
      <Helmet title={event.name} />
      <Header>
        <EventSelect event={event} events={events} path="edit" />
        {isFinite(percentComplete) && (
          <Box flexGrow={1} mx={4} maxW="md">
            <Text fontSize="sm" mb={1} lineHeight="none">
              {Math.round(percentComplete)} % complete
            </Text>
            <Progress value={percentComplete} rounded="full" size="xs" />
          </Box>
        )}
        <CreateGameButton eventId={event.id} />
      </Header>
      <GamesList rounds={rounds} numRounds={numRounds} />
    </div>
  );
}

GetEvent.propTypes = {
  variables: PropTypes.object.isRequired
};

export default function EditEvent({params}) {
  return (
    <NoSSR>
      <GetEvent variables={{id: params.id}} />
    </NoSSR>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
