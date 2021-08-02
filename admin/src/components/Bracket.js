import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';
import {Flex} from '@chakra-ui/layout';
import {Link as GatsbyLink} from 'gatsby';

function getReplacement(skater, replacements) {
  return replacements.find(replacement => replacement.out.id === skater.id);
}

export function createBracket(games, round, rounds) {
  const nextRound = round - 1;
  return games.map(game => {
    const skaterIds = game.skaters.map(skater => {
      const replacement = getReplacement(skater, game.replacements);
      return (replacement?.out || skater).id;
    });
    return {
      ...game,
      round,
      children: nextRound
        ? createBracket(
            rounds[nextRound].filter(game =>
              game.skaters.some(skater => {
                const replacement = getReplacement(skater, game.replacements);
                // TODO: account for byes (in is null)
                return skaterIds.includes((replacement?.in || skater).id);
              })
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
        {game.skaters.map((skater, index) => {
          const replacement = getReplacement(skater, game.replacements);
          return (
            <Box
              py={1}
              px={2}
              isTruncated
              key={index}
              borderBottomWidth={1 - index}
            >
              {replacement ? (
                <>
                  <s>{skater.fullName}</s>{' '}
                  {replacement.in ? replacement.in.fullName : 'Bye'}
                </>
              ) : (
                skater.fullName
              )}
            </Box>
          );
        })}
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
