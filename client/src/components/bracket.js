import BracketSegment from './bracket-segment';
import PropTypes from 'prop-types';
import React from 'react';

function addGameChildren(game, rounds, index) {
  const children = rounds[index];
  if (!children) {
    return game;
  }

  const replacements = game.replacements.map(replacement => replacement.outId);
  const skaterIds = game.skaters.map(skater => skater.id).concat(replacements);
  return {
    ...game,
    children: children
      .filter(
        child =>
          child.skaters
            .map(skater => skater.id)
            .filter(skaterId => skaterIds.includes(skaterId)).length
      )
      .map(child =>
        addGameChildren(
          replacements.length
            ? {
                ...child,
                skaters: child.skaters.map(skater => ({
                  ...skater,
                  replaced: replacements.includes(skater.id)
                }))
              }
            : child,
          rounds,
          index + 1
        )
      )
  };
}

export default function Bracket(props) {
  const groups = props.games
    .filter(game => game.round !== 5)
    .reduce((acc, game) => {
      const games = acc[game.round];
      if (games) {
        return {
          ...acc,
          [game.round]: [...games, game]
        };
      }

      return {
        ...acc,
        [game.round]: [game]
      };
    }, {});

  const rounds = Object.values(groups).reverse();
  const game = addGameChildren(rounds[0][0], rounds, 1);
  return <BracketSegment game={game} />;
}

Bracket.propTypes = {
  games: PropTypes.array.isRequired
};
