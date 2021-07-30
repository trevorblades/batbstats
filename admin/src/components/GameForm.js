import CreateSkaterButton from './CreateSkaterButton';
import NumberOfRedos from './NumberOfRedos';
import PropTypes from 'prop-types';
import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import RoshamboButtons, {ROSHAMBO} from './RoshamboButtons';
import SkaterSelect from './SkaterSelect';
import TrickSelect from './TrickSelect';
import {
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Stack,
  chakra
} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import {SKATE} from '../utils';

function insert(array, index, item) {
  return [...array.slice(0, index), item, ...array.slice(index + 1)];
}

function getScore(attempts) {
  return attempts.reduce((acc, {defense, ...attempt}) => {
    if (attempt.successful && !defense.successful) {
      const existing = acc[defense.skater.id];
      return {
        ...acc,
        [defense.skater.id]: existing ? existing + 1 : 1
      };
    }
    return acc;
  }, {});
}

function GameForm(
  {defaultSkaters = [null, null], defaultRoshambos = [], defaultAttempts = []},
  ref
) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  const [roshambos, setRoshambos] = useState(defaultRoshambos);
  const [attempts, setAttempts] = useState(defaultAttempts);

  useImperativeHandle(
    ref,
    () => ({
      value: () => ({
        skaters,
        roshambos,
        attempts
      })
    }),
    [skaters, roshambos, attempts]
  );

  const [roshamboWinner, isRoshamboTied] = useMemo(() => {
    const lastRound = roshambos[roshambos.length - 1];
    const [p1, p2] = skaters.map(skaterId => lastRound?.[skaterId]);

    // if the round is incomplete or a tie return null
    const isTied = p1 === p2;
    if (!p1 || !p2 || isTied) {
      return [null, isTied];
    }

    // check to see if p2 is countering p1 and return the appropriate skater id
    return [skaters[Number(ROSHAMBO[p1].counter === p2)], false];
  }, [roshambos, skaters]);

  const winner = useMemo(() => {
    const score = {};
    for (const {defense, ...attempt} of attempts) {
      // when someone scores a letter
      if (attempt.successful && !defense.successful) {
        // if the defender is at T
        if (score[defense.skater.id] === 4) {
          // then we return the offensive skater's id
          return attempt.skater.id;
        }

        // otherwise we increment the letter count for the defender
        score[defense.skater.id] =
          defense.skater.id in score ? score[defense.skater.id] + 1 : 1;
      }
    }

    return null;
  }, [attempts]);

  const [offensiveSkater, offensiveSkaterIndex] = useMemo(() => {
    const lastAttempt = attempts[attempts.length - 1];
    const offensiveSkater = lastAttempt
      ? lastAttempt.successful
        ? lastAttempt.skater.id
        : // get the other skater by inversing the index of the current one
          skaters[1 - skaters.indexOf(lastAttempt.skater.id)]
      : roshamboWinner;
    return [offensiveSkater, skaters.indexOf(offensiveSkater)];
  }, [attempts, skaters, roshamboWinner]);

  const abd = useMemo(
    () =>
      attempts
        .filter(attempt => attempt.successful)
        .map(attempt => attempt.trick.id),
    [attempts]
  );

  function setSkater(skater, index) {
    // insert new skater into a specific index
    setSkaters(prev => insert(prev, index, skater));
    // reset everything when either skater changes
    setRoshambos([]);
    setAttempts([]);
  }

  return (
    <chakra.table
      w="full"
      sx={{
        td: {
          px: 2,
          py: 5,
          ':not(:last-child)': {
            textAlign: 'right'
          }
        }
      }}
    >
      <tbody>
        <tr>
          {skaters.map((skater, index) => (
            <td key={index}>
              <Stack align={!index ? 'flex-end' : null}>
                <Flex w="full">
                  <SkaterSelect
                    value={skater}
                    onChange={event => setSkater(event.target.value, index)}
                  />
                  <CreateSkaterButton
                    setSkater={skater => setSkater(skater.id, index)}
                  />
                </Flex>
                <Checkbox>Was this skater replaced?</Checkbox>
              </Stack>
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
                    {...prev[index], ...play}
                  ]);
                  // reset attempts when roshambo changes
                  setAttempts([]);
                }}
              />
            ))}
            {/* show an additional round there is no winner */}
            {roshamboWinner ? (
              <>
                {attempts.map(({defense, ...attempt}, index, arr) => {
                  const skaterIndex = skaters.indexOf(attempt.skater.id);
                  const {[defense?.skater.id]: letters} = getScore(
                    arr.slice(0, index + 1)
                  );
                  const letter = (
                    <chakra.td fontWeight="bold" fontSize="2xl">
                      {attempt.successful &&
                        !defense.successful &&
                        SKATE[letters - 1]}
                    </chakra.td>
                  );
                  return (
                    <tr key={index}>
                      {skaterIndex > 0 && letter}
                      <td>
                        <Stack align={!skaterIndex ? 'flex-end' : null}>
                          <HStack>
                            <span>{attempt.trick.name}</span>
                            <IconButton
                              size="xs"
                              icon={<CloseIcon />}
                              onClick={() =>
                                setAttempts(prev => prev.slice(0, index))
                              }
                            />
                          </HStack>
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
                                          redos: 0,
                                          skater: {
                                            id: skaters[1 - skaterIndex]
                                          }
                                        }
                                      : null
                                  }
                                ];
                              })
                            }
                          >
                            Was it set?
                          </Checkbox>
                          <NumberOfRedos
                            value={attempt.redos}
                            onChange={(_, redos) =>
                              setAttempts(prev =>
                                insert(prev, index, {
                                  ...prev[index],
                                  redos
                                })
                              )
                            }
                          />
                          {defense && (
                            <>
                              <Checkbox
                                isChecked={defense.successful}
                                onChange={event =>
                                  setAttempts(prev => {
                                    const {
                                      defense: prevDefense,
                                      ...prevAttempt
                                    } = prev[index];
                                    return insert(prev, index, {
                                      ...prevAttempt,
                                      defense: {
                                        ...prevDefense,
                                        successful: event.target.checked
                                      }
                                    });
                                  })
                                }
                              >
                                Was it defended?
                              </Checkbox>
                              <NumberOfRedos
                                value={defense.redos}
                                onChange={(_, redos) =>
                                  setAttempts(prev => {
                                    const {
                                      defense: prevDefense,
                                      ...prevAttempt
                                    } = prev[index];
                                    return insert(prev, index, {
                                      ...prevAttempt,
                                      defense: {
                                        ...prevDefense,
                                        redos
                                      }
                                    });
                                  })
                                }
                              />
                            </>
                          )}
                        </Stack>
                      </td>
                      {!skaterIndex && letter}
                    </tr>
                  );
                })}
                {/* only render next trick selection if the game is still on */}
                {!winner && (
                  <tr>
                    {offensiveSkaterIndex > 0 && <td />}
                    <td>
                      <TrickSelect
                        abd={abd}
                        key={attempts.length}
                        onTrickChange={trick =>
                          setAttempts(prev => [
                            ...prev,
                            {
                              trick,
                              successful: false,
                              redos: 0,
                              skater: {
                                id: offensiveSkater
                              }
                            }
                          ])
                        }
                      />
                    </td>
                    {!offensiveSkaterIndex && <td />}
                  </tr>
                )}
              </>
            ) : (
              isRoshamboTied && (
                <RoshamboButtons
                  skaters={skaters}
                  onChange={play => setRoshambos(prev => [...prev, play])}
                />
              )
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

export default forwardRef(GameForm);
