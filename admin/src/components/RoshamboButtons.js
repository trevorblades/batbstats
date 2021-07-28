import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import {Button, ButtonGroup} from '@chakra-ui/react';

const ROSHAMBO_DATA = {
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

export default function RoshamboButtons({round, skaters, onChange}) {
  const winner = useMemo(() => {
    const [p1, p2] = skaters.map(skaterId => round?.[skaterId]);

    // if the round is incomplete or a tie return null
    if (!p1 || !p2 || p1 === p2) {
      return null;
    }

    // check to see if p2 is countering p1 and return the appropriate skater id
    return skaters[Number(ROSHAMBO_DATA[p1].counter === p2)];
  }, [round, skaters]);

  return skaters.map(skaterId => (
    <ButtonGroup size="lg" isAttached key={skaterId}>
      {Object.entries(ROSHAMBO_DATA).map(([move, {emoji}]) => (
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
  skaters: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};
