import GameForm from './GameForm';
import PropTypes from 'prop-types';
import React, {useRef, useState} from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {GAME_FRAGMENT} from '../utils';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from '../assets/logo.svg';
import {gql, useMutation} from '@apollo/client';

const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $input: GameInput!) {
    updateGame(id: $id, input: $input) {
      ...GameFragment
    }
  }
  ${GAME_FRAGMENT}
`;

export default function UpdateGameForm({game}) {
  const gameForm = useRef();
  const toast = useToast();
  const [key, setKey] = useState(1);
  const bg = useColorModeValue('gray.50', 'gray.700');

  const [updateGame, {loading}] = useMutation(UPDATE_GAME, {
    onError: error =>
      toast({
        status: 'error',
        title: 'Error saving game',
        description: error.message
      })
  });

  const {id, round, event, skaters, roshambos, attempts} = game;
  const title = `${event.name}: Round ${round}`;

  function handleSubmit(event) {
    event.preventDefault();
    updateGame({
      variables: {
        id,
        input: gameForm.current.value()
      }
    });
  }

  return (
    <>
      <Helmet title={title} />
      <form onSubmit={handleSubmit}>
        <Flex
          bg={bg}
          as="header"
          pos="sticky"
          top="0"
          align="center"
          px={4}
          py={2}
          zIndex="1"
        >
          <Box as={Logo} mr="3" boxSize={6} fill="current" />
          {title}
          <ButtonGroup ml="auto" size="sm">
            <Button onClick={() => setKey(prev => prev + 1)}>
              Discard changes
            </Button>
            <Button isLoading={loading} colorScheme="green" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Flex>
        <Box px={1}>
          <GameForm
            key={key}
            ref={gameForm}
            defaultSkaters={skaters.map(skater => skater.id)}
            // reduce flat array of roshambo rounds into roshambo round format
            // [{[id]: move}]
            defaultRoshambos={Object.values(
              roshambos.reduce((acc, roshambo) => {
                const existing = acc[roshambo.round];
                const next = {[roshambo.skater.id]: roshambo.move};
                return {
                  ...acc,
                  [roshambo.round]: existing ? {...existing, ...next} : next
                };
              }, {})
            )}
            defaultAttempts={attempts.reduce((acc, attempt) => {
              if (attempt.offense) {
                return [...acc, attempt];
              }

              return [
                ...acc.slice(0, -1),
                {
                  ...acc[acc.length - 1],
                  defense: attempt
                }
              ];
            }, [])}
          />
        </Box>
      </form>
    </>
  );
}

UpdateGameForm.propTypes = {
  game: PropTypes.object.isRequired
};
