import CreateSkaterButton from './CreateSkaterButton';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import RoshamboButtons from './RoshamboButtons';
import SkaterSelect from './SkaterSelect';
import isEqual from 'lodash/isEqual';
import {Flex, SimpleGrid} from '@chakra-ui/react';

export default function GameForm({
  defaultSkaters = [null, null],
  defaultRoshambos = []
}) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  const [roshambos, setRoshambos] = useState(defaultRoshambos);

  // show an additional round if it's tied or no rounds have been recorded
  const isRoshamboTied =
    roshambos.length === 0 ||
    isEqual(...Object.values(roshambos[roshambos.length - 1]));

  function setSkater(skater, index) {
    // insert new skater into a specific index
    setSkaters(prev => [
      ...prev.slice(0, index),
      skater,
      ...prev.slice(index + 1)
    ]);
    // reset roshambos when either skater changes
    setRoshambos([]);
  }

  return (
    <SimpleGrid columns={2} spacing={6} p={6}>
      {skaters.map((skater, index) => (
        <Flex key={index}>
          <SkaterSelect
            value={skater}
            onChange={event => setSkater(event.target.value, index)}
          />
          <CreateSkaterButton
            setSkater={skater => setSkater(skater.id, index)}
          />
        </Flex>
      ))}
      {skaters.length === 2 && (
        <>
          {roshambos.map((roshambo, index) => (
            <RoshamboButtons
              key={index}
              skaters={skaters}
              round={roshambo}
              onChange={play =>
                setRoshambos(prev => [
                  ...prev.slice(0, index),
                  {...roshambo, ...play}
                ])
              }
            />
          ))}
          {isRoshamboTied && (
            <RoshamboButtons
              skaters={skaters}
              onChange={play => setRoshambos(prev => [...prev, play])}
            />
          )}
        </>
      )}
    </SimpleGrid>
  );
}

GameForm.propTypes = {
  defaultSkaters: PropTypes.array,
  defaultRoshambos: PropTypes.array
};
