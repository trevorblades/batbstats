import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup, chakra} from '@chakra-ui/react';

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
  return (
    <tr>
      {skaters.map((skaterId, index) => (
        <chakra.td textAlign={index ? 'left' : 'right'} key={skaterId}>
          <ButtonGroup size="lg" isAttached>
            {Object.entries(ROSHAMBO).map(([move, {emoji}]) => {
              const isSelected = move === round?.[skaterId];
              return (
                <Button
                  key={move}
                  colorScheme={
                    isSelected ? (winner === skaterId ? 'green' : 'blue') : null
                  }
                  onClick={() => {
                    if (!isSelected) {
                      onChange({[skaterId]: move});
                    }
                  }}
                >
                  {emoji}
                </Button>
              );
            })}
          </ButtonGroup>
        </chakra.td>
      ))}
    </tr>
  );
}

RoshamboButtons.propTypes = {
  round: PropTypes.object,
  winner: PropTypes.string,
  skaters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
