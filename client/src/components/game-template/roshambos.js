import Commentary from './commentary';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box, TableCell, TableRow} from '@material-ui/core';
import {ReactComponent as Paper} from 'twemoji/2/svg/270b.svg';
import {ReactComponent as Rock} from 'twemoji/2/svg/270a.svg';
import {ReactComponent as Scissors} from 'twemoji/2/svg/270c.svg';

const ROSHAMBOS = {
  rock: {
    emoji: Rock,
    counter: 'paper'
  },
  paper: {
    emoji: Paper,
    counter: 'scissors'
  },
  scissors: {
    emoji: Scissors,
    counter: 'rock'
  }
};

export default function Roshambos(props) {
  // organize the roshambos into an array of "rounds"
  // [{p1: move, p2: move}, ...]
  const rounds = Object.values(
    props.roshambos.reduce((acc, roshambo) => {
      const round = acc[roshambo.round];
      const move = {[roshambo.skaterId]: roshambo.move};
      if (round) {
        return {
          ...acc,
          [roshambo.round]: {...round, ...move}
        };
      }

      return {...acc, [roshambo.round]: move};
    }, {})
  );

  const lastRound = rounds[rounds.length - 1];
  const [[winnerId, winningMove], loser] = Object.entries(lastRound).sort(
    (a, b) => {
      // compare the two moves and sort the array so the winner is first
      // the winner is the element who's move equals the other move's counter
      const {counter} = ROSHAMBOS[a[1]];
      return counter === b[1] ? 1 : -1;
    }
  );

  const winner = props.skaters.find(skater => skater.id === winnerId);
  return (
    <Fragment>
      {rounds.map((round, index) => (
        <TableRow key={index}>
          {props.skaters.map((skater, index) => {
            const move = round[skater.id];
            const {emoji} = ROSHAMBOS[move];
            return (
              <TableCell key={skater.id} align={index ? 'left' : 'right'}>
                <span title={move}>
                  <Box component={emoji} width={32} height={32} />
                </span>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
      <Commentary>
        {winningMove.charAt(0).toUpperCase() + winningMove.slice(1)} beats{' '}
        {loser[1]}, {winner.firstName} goes first
      </Commentary>
    </Fragment>
  );
}

Roshambos.propTypes = {
  roshambos: PropTypes.array.isRequired,
  skaters: PropTypes.array.isRequired
};
