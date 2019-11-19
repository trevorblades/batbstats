import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {TableCell, TableRow} from '@material-ui/core';

export default function Rounds(props) {
  const rounds = [];
  for (let i = 0; i < props.attempts.length; i++) {
    let attempt = props.attempts[i];
    const round = {[attempt.skaterId]: attempt};
    if (attempt.successful) {
      i++;
      attempt = props.attempts[i];
      round[attempt.skaterId] = attempt;
    }

    rounds.push(round);
  }

  return (
    <Fragment>
      {rounds.map((round, index) => (
        <TableRow key={index}>
          {props.skaters.map((skater, index) => {
            const attempt = round[skater.id];
            return (
              <TableCell align={index ? 'left' : 'right'} key={skater.id}>
                {attempt && (
                  <span
                    style={{
                      textDecoration:
                        attempt.offense && !attempt.successful
                          ? 'line-through'
                          : 'none'
                    }}
                  >
                    {attempt.offense
                      ? attempt.trick.name
                      : attempt.successful
                      ? '✅'
                      : '❌'}
                  </span>
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </Fragment>
  );
}

Rounds.propTypes = {
  attempts: PropTypes.array.isRequired,
  skaters: PropTypes.array.isRequired
};
