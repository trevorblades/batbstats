import PropTypes from 'prop-types';
import React from 'react';
import {Box, Button, List, ListItem, useColorModeValue} from '@chakra-ui/react';
import {Link as GatsbyLink} from 'gatsby';
import {HEADER_HEIGHT} from './Header';
import {getRoundName, getVersus, groupByRound} from '../utils';

export default function GamesList({games}) {
  const listHeaderBg = useColorModeValue('white', 'gray.800');
  const rounds = groupByRound(games);
  return (
    <List>
      {Object.entries(rounds).map(([round, games]) => (
        <Box key={round} zIndex={0} pos="relative">
          <ListItem
            pos="sticky"
            top={HEADER_HEIGHT}
            bg={listHeaderBg}
            borderBottomWidth="1px"
            fontSize="sm"
            fontWeight="semibold"
            py={1}
            px={4}
            zIndex={1}
          >
            {getRoundName(round)}
          </ListItem>
          {games.map(game => (
            <ListItem key={game.id}>
              <Button
                isFullWidth
                variant="ghost"
                as={GatsbyLink}
                to={`/games/${game.id}/edit`}
                rounded="none"
                justifyContent="flex-start"
                fontWeight="normal"
              >
                {getVersus(game.skaters)}
              </Button>
            </ListItem>
          ))}
        </Box>
      ))}
    </List>
  );
}

GamesList.propTypes = {
  games: PropTypes.array.isRequired
};
