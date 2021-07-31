import Header from '../../../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {EVENT_FRAGMENT, getRoundName} from '../../../utils';
import {Flex, Heading} from '@chakra-ui/layout';
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

function findParent(game, rounds) {
  const nextRound = rounds[game.round + 1];
  const skaterIds = game.skaters.map(skater => skater.id);
  if (nextRound) {
    const parent = nextRound.find(game =>
      game.skaters.some(skater => skaterIds.includes(skater.id))
    );
    if (parent) {
      return findParent(parent, rounds);
      // return findParent(parent, rounds);
    }
  }

  return game;
}

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
  const {length: firstRound} = data.event.games.filter(
    game => game.round === 1
  );

  // needed to learn how to solve for exponents
  // https://www.calculatorsoup.com/calculators/algebra/exponentsolve.php
  const numRounds = !firstRound
    ? 1
    : firstRound === 1
    ? 2
    : Math.ceil(Math.log2(firstRound)) + 1;

  console.log(firstRound, numRounds);

  return (
    <div>
      <Helmet title={data.event.name} />
      <Header title={data.event.name} />
      <Flex>
        {/* {Object.entries(rounds).map(([round, games]) => (
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
        ))} */}
      </Flex>
    </div>
  );
}

EditEvent.propTypes = {
  params: PropTypes.object.isRequired
};
