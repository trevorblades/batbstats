import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {Box, Link} from '@chakra-ui/react';
import {EVENT_FRAGMENT} from '../../../utils';
import {Flex} from '@chakra-ui/layout';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {gql, useQuery} from '@apollo/client';

const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
      ...EventFragment
    }
  }
  ${EVENT_FRAGMENT}
`;

function createBracket(games, round, rounds) {
  return games.map(game => {
    const nextRound = round - 1;
    const skaterIds = game.skaters.map(skater => skater.id);
    return {
      ...game,
      round,
      children: nextRound
        ? createBracket(
            rounds[nextRound].filter(game =>
              game.skaters.some(skater => skaterIds.includes(skater.id))
            ),
            nextRound,
            rounds
          )
        : null
    };
  });
}

function Bracket({game}) {
  return (
    <Flex align="center">
      <Box flexShrink={0} w={200} py={4}>
        {game.skaters ? (
          <Link as={GatsbyLink} to={`/games/${game.id}/edit`}>
            {game.skaters.map(skater => (
              <Box isTruncated key={skater.id}>
                {skater.fullName}
              </Box>
            ))}
          </Link>
        ) : (
          '? vs. ?'
        )}
      </Box>
      <div>
        {game.children?.map((child, index) => (
          <Bracket key={index} game={child} />
        ))}
      </div>
    </Flex>
  );
}

Bracket.propTypes = {
  game: PropTypes.object.isRequired
};

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

  // number of rounds increases by 1 for each set of two first round games
  const rounds = data.event.games.reduce((acc, game) => {
    const existing = acc[game.round];
    return {
      ...acc,
      [game.round]: existing ? [...existing, game] : [game]
    };
  }, {});

  // needed to learn how to solve for exponents
  // https://www.calculatorsoup.com/calculators/algebra/exponentsolve.php
  const firstRound = rounds[1]?.length;
  const numRounds = !firstRound
    ? 1
    : firstRound === 1
    ? 2
    : // learned about log2
      // same as doing log(x) / log(2)
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/log2
      Math.ceil(Math.log2(firstRound)) + 1;

  const [bracket] = createBracket(rounds[numRounds], numRounds, rounds);

  return (
    <div>
      <Helmet title={data.event.name} />
      <Header title={data.event.name} />
      <Bracket game={bracket} />
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
