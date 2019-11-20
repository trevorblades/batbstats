import BracketSegment from './bracket-segment';
import PropTypes from 'prop-types';
import React, {useMemo, useRef, useState} from 'react';
import {Box} from '@material-ui/core';

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
  const wrapperRef = useRef();
  const [dragging, setDragging] = useState(false);

  const game = useMemo(() => {
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
    return addGameChildren(rounds[0][0], rounds, 1);
  }, [props.games]);

  function handleMouseDown() {
    setDragging(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event) {
    wrapperRef.current.scrollLeft -= event.movementX;
  }

  function handleMouseUp() {
    setDragging(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  return (
    <Box
      pt={1}
      p={4}
      style={{
        overflowX: 'auto',
        cursor: dragging ? 'grabbing' : 'grab'
      }}
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
    >
      <BracketSegment game={game} />
    </Box>
  );
}

Bracket.propTypes = {
  games: PropTypes.array.isRequired
};
