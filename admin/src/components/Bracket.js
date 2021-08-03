import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@chakra-ui/react';
import {Flex} from '@chakra-ui/layout';
import {Link as GatsbyLink} from 'gatsby';
import {useCardProps} from '../utils';

function findReplacement(skater, replacements) {
  return replacements.find(replacement => replacement.in?.id === skater.id);
}

export function createBracket(games, round, rounds) {
  const nextRound = round - 1;
  return games.map(game => {
    const skaterIds = game.skaters.map(skater => {
      const replacement = findReplacement(skater, game.replacements);
      return (replacement?.out || skater).id;
    });
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

export default function Bracket({game}) {
  const cardProps = useCardProps();
  const bye = game.replacements.find(replacement => replacement.in === null);
  const boxProps = bye
    ? {color: 'gray.500'}
    : {
        ...cardProps,
        as: GatsbyLink,
        to: `/games/${game.id}`
      };
  return (
    <Flex align="center">
      {game.children && (
        <Flex alignSelf="stretch" align="center">
          <div>
            {game.children.map((child, index) => (
              <Bracket key={index} game={child} />
            ))}
          </div>
          <Box
            w={10}
            h="calc(50% + 1px)"
            flexShrink={0}
            borderWidth="1px"
            borderLeftWidth={0}
          />
          <Box w={10} h="px" borderBottomWidth="1px" />
        </Flex>
      )}
      <Box
        {...boxProps}
        my={5}
        flexShrink={0}
        w={200}
        rounded="md"
        borderWidth="1px"
      >
        {game.skaters.map((skater, index) => {
          const replacement = findReplacement(skater, game.replacements);
          return (
            <Box
              py={1}
              px={2}
              isTruncated
              key={index}
              borderBottomWidth={1 - index}
            >
              {bye?.out.id === skater.id ? (
                <s>{bye.out.fullName}</s>
              ) : (
                <>
                  {replacement && <s>{replacement.out.fullName}</s>}{' '}
                  {skater.fullName} {bye && '(bye)'}
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Flex>
  );
}

Bracket.propTypes = {
  game: PropTypes.object.isRequired
};
