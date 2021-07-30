import GameForm from '../../components/GameForm';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  useColorModeValue
} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import {gql, useQuery} from '@apollo/client';

const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      round
      event {
        name
      }
      skaters {
        id
        fullName
      }
      roshambos {
        id
        round
        move
        skater {
          id
        }
      }
      attempts {
        id
        offense
        successful
        redos
        trick {
          id
          name
        }
        skater {
          id
        }
      }
    }
  }
`;

function Header(props) {
  const bg = useColorModeValue('gray.100', 'gray.700');
  return (
    <Flex
      bg={bg}
      as="header"
      pos="sticky"
      top="0"
      align="center"
      px={4}
      py={2}
      zIndex="1"
      {...props}
    />
  );
}

export default function Game({params}) {
  const {data, loading, error} = useQuery(GET_GAME, {
    variables: {id: params.id}
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data.game) {
    return <div>Game not found</div>;
  }

  const {round, event, skaters, roshambos, attempts} = data.game;
  const title = `${event.name}: Round ${round}`;

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <>
      <Helmet title={title} />
      <form onSubmit={handleSubmit}>
        <Header>
          <Box as={Logo} mr="3" boxSize={6} fill="current" />
          {title}
          <ButtonGroup ml="auto" size="sm">
            <Button>Discard changes</Button>
            <Button colorScheme="green" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Header>
        <Box px={1}>
          <GameForm
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

Game.propTypes = {
  params: PropTypes.object
};
