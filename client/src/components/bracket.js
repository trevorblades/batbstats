import BracketSegment from './bracket-segment';
import PropTypes from 'prop-types';
import React from 'react';
import {groupBy, intersection} from 'lodash';

function addGameChildren(game, rounds, index) {
  const children = rounds[index];
  if (!children) {
    return game;
  }

  const replacements = game.replacements.map(replacement => replacement.outId);
  const skaters = game.skaters.map(skater => skater.id).concat(replacements);
  return {
    ...game,
    children: children
      .filter(
        child =>
          intersection(
            skaters,
            child.skaters.map(skater => skater.id)
          ).length
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
  const games = props.games.filter(game => game.round !== 5);
  const groups = groupBy(games, 'round');
  const rounds = Object.values(groups).reverse();
  const game = addGameChildren(rounds[0][0], rounds, 1);
  return <BracketSegment game={game} />;
}

Bracket.propTypes = {
  games: PropTypes.array.isRequired
};
