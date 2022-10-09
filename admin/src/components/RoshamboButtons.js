import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup, chakra} from '@chakra-ui/react';
import {ROSHAMBO} from '../utils';

export default function RoshamboButtons({round, skaterIds, winner, onChange}) {
  return (
    <tr>
      {skaterIds.map((skaterId, index) => (
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
  skaterIds: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
