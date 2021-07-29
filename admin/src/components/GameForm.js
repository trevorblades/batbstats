import CreateSkaterButton from './CreateSkaterButton';
import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import RoshamboButtons, {ROSHAMBO} from './RoshamboButtons';
import SkaterSelect from './SkaterSelect';
import {Flex, SimpleGrid} from '@chakra-ui/react';

export default function GameForm({
  defaultSkaters = [null, null],
  defaultRoshambos = [],
  defaultAttempts = []
}) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  const [roshambos, setRoshambos] = useState(defaultRoshambos);
  const [attempts] = useState(defaultAttempts);

  const roshamboWinner = useMemo(() => {
    const lastRound = roshambos[roshambos.length - 1];
    const [p1, p2] = skaters.map(skaterId => lastRound?.[skaterId]);

    // if the round is incomplete or a tie return null
    if (!p1 || !p2 || p1 === p2) {
      return null;
    }

    // check to see if p2 is countering p1 and return the appropriate skater id
    return skaters[Number(ROSHAMBO[p1].counter === p2)];
  }, [roshambos, skaters]);

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

  console.log(skaters.indexOf(roshamboWinner), attempts);

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
          {roshambos.map((roshambo, index, arr) => (
            <RoshamboButtons
              key={index}
              skaters={skaters}
              round={roshambo}
              winner={index === arr.length - 1 ? roshamboWinner : null}
              onChange={play =>
                setRoshambos(prev => [
                  ...prev.slice(0, index),
                  {...roshambo, ...play}
                ])
              }
            />
          ))}
          {/* show an additional round there is no winner */}
          {roshamboWinner ? (
            attempts.map(attempt => (
              <div key={attempt.id}>{attempt.trick.name}</div>
            ))
          ) : (
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
  defaultRoshambos: PropTypes.array,
  defaultAttempts: PropTypes.array
};
