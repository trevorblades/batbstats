import GameForm from '../../components/GameForm';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Flex} from '@chakra-ui/react';
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
          name
        }
        skater {
          id
        }
      }
    }
  }
`;

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

  return (
    <>
      <Helmet title={title} />
      <Flex align="center" px={4} py={2}>
        <Box as={Logo} mr="3" boxSize={6} fill="current" />
        {title}
      </Flex>
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
    </>
  );
}

Game.propTypes = {
  params: PropTypes.object
};
