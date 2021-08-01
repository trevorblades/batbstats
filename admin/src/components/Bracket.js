import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';
import {Flex} from '@chakra-ui/layout';
import {Link as GatsbyLink} from 'gatsby';

export function createBracket(games, round, rounds) {
  const nextRound = round - 1;
  return games.map(game => {
    const skaterIds = game.skaters.map(skater => skater.id);
    return {
      ...game,
      round,
      children: nextRound
        ? createBracket(
            // TODO: account for replacements
            rounds[nextRound].filter(({skaters}) =>
              skaters.some(skater => skaterIds.includes(skater.id))
            ),
            nextRound,
            rounds
          )
        : null
    };
  });
}

export default function Bracket({game}) {
  const gameProps = game.id
    ? {
        as: GatsbyLink,
        to: `/games/${game.id}`
      }
    : {
        as: 'button',
        onClick: () => console.log('create game'),
        textAlign: 'left'
      };
  return (
    <Flex align="center">
      <Box {...gameProps} my={4} flexShrink={0} w={200} borderWidth="1px">
        {game.skaters.map((skater, index) => (
          <Box
            py={1}
            px={2}
            isTruncated
            key={index}
            borderBottomWidth={1 - index}
          >
            {skater?.fullName || '?'}
          </Box>
        ))}
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
