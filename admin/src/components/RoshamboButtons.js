import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup} from '@chakra-ui/react';

export const ROSHAMBO = {
  rock: {
    emoji: '🪨',
    counter: 'paper'
  },
  paper: {
    emoji: '📄',
    counter: 'scissors'
  },
  scissors: {
    emoji: '✂️',
    counter: 'rock'
  }
};

export default function RoshamboButtons({round, skaters, winner, onChange}) {
  return skaters.map(skaterId => (
    <ButtonGroup size="lg" isAttached key={skaterId}>
      {Object.entries(ROSHAMBO).map(([move, {emoji}]) => (
        <Button
          key={move}
          colorScheme={
            move === round?.[skaterId]
              ? winner === skaterId
                ? 'green'
                : 'blue'
              : null
          }
          onClick={() => onChange({[skaterId]: move})}
        >
          {emoji}
        </Button>
      ))}
    </ButtonGroup>
  ));
}

RoshamboButtons.propTypes = {
  round: PropTypes.object,
  winner: PropTypes.string,
  skaters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
