import CreateSkaterButton from './CreateSkaterButton';
import NumberOfRedos from './NumberOfRedos';
import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import RoshamboButtons, {ROSHAMBO} from './RoshamboButtons';
import SkaterSelect from './SkaterSelect';
import {Checkbox, Flex, Stack, chakra} from '@chakra-ui/react';

export default function GameForm({
  defaultSkaters = [null, null],
  defaultRoshambos = [],
  defaultAttempts = []
}) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  const [roshambos, setRoshambos] = useState(defaultRoshambos);
  const [attempts, setAttempts] = useState(defaultAttempts);

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
    // reset everything when either skater changes
    setRoshambos([]);
    setAttempts([]);
  }

  return (
    <chakra.table
      w="full"
      p={4}
      sx={{
        td: {
          py: 3
        }
      }}
    >
      <tbody>
        <tr>
          {skaters.map((skater, index) => (
            <td key={index}>
              <Flex>
                <SkaterSelect
                  value={skater}
                  onChange={event => setSkater(event.target.value, index)}
                />
                <CreateSkaterButton
                  setSkater={skater => setSkater(skater.id, index)}
                />
              </Flex>
            </td>
          ))}
        </tr>
        {skaters.length === 2 && (
          <>
            {roshambos.map((roshambo, index, arr) => (
              <RoshamboButtons
                key={index}
                skaters={skaters}
                round={roshambo}
                winner={index === arr.length - 1 ? roshamboWinner : null}
                onChange={play => {
                  setRoshambos(prev => [
                    ...prev.slice(0, index),
                    {...roshambo, ...play}
                  ]);
                  // reset attempts when roshambo changes
                  setAttempts([]);
                }}
              />
            ))}
            {/* show an additional round there is no winner */}
            {roshamboWinner ? (
              attempts.map(({defense, ...attempt}, index) => {
                const skaterIndex = skaters.indexOf(attempt.skater.id);
                return (
                  <tr key={attempt.id}>
                    {skaterIndex > 0 && <td />}
                    <td>
                      <Stack align={!skaterIndex ? 'flex-end' : null}>
                        <div>{attempt.trick.name}</div>
                        <Checkbox
                          isChecked={attempt.successful}
                          onChange={event =>
                            setAttempts(prev => {
                              const {checked} = event.target;
                              return [
                                ...prev.slice(0, index),
                                {
                                  ...prev[index],
                                  successful: checked,
                                  defense: checked
                                    ? {
                                        successful: false,
                                        redos: 0
                                      }
                                    : null
                                }
                              ];
                            })
                          }
                        >
                          Was it set?
                        </Checkbox>
                        {defense && (
                          <>
                            <NumberOfRedos
                              value={attempt.redos}
                              onChange={(_, redos) =>
                                setAttempts(prev => [
                                  ...prev.slice(0, index),
                                  {
                                    ...prev[index],
                                    redos
                                  },
                                  ...prev.slice(index + 1)
                                ])
                              }
                            />
                            <Checkbox
                              isChecked={defense.successful}
                              onChange={event =>
                                setAttempts(prev => {
                                  const {defense, ...attempt} = prev[index];
                                  return [
                                    ...prev.slice(0, index),
                                    {
                                      ...attempt,
                                      defense: {
                                        ...defense,
                                        successful: event.target.checked
                                      }
                                    }
                                  ];
                                })
                              }
                            >
                              Was it defended?
                            </Checkbox>
                            {defense.successful && (
                              <NumberOfRedos
                                value={defense.redos}
                                onChange={(_, redos) =>
                                  setAttempts(prev => {
                                    const {defense, ...attempt} = prev[index];
                                    return [
                                      ...prev.slice(0, index),
                                      {
                                        ...attempt,
                                        defense: {
                                          ...defense,
                                          redos
                                        }
                                      },
                                      ...prev.slice(index + 1)
                                    ];
                                  })
                                }
                              />
                            )}
                          </>
                        )}
                      </Stack>
                    </td>
                    {!skaterIndex && <td />}
                  </tr>
                );
              })
            ) : (
              <RoshamboButtons
                skaters={skaters}
                onChange={play => setRoshambos(prev => [...prev, play])}
              />
            )}
          </>
        )}
      </tbody>
    </chakra.table>
  );
}

GameForm.propTypes = {
  defaultSkaters: PropTypes.array,
  defaultRoshambos: PropTypes.array,
  defaultAttempts: PropTypes.array
};
