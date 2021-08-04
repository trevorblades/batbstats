import CreateTrickButton from './CreateTrickButton';
import Header, {HEADER_HEIGHT} from './Header';
import NumberOfRedos from './NumberOfRedos';
import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import RoshamboButtons, {ROSHAMBO} from './RoshamboButtons';
import TrickSelect from './TrickSelect';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Stack,
  chakra,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import {CloseIcon} from '@chakra-ui/icons';
import {GAME_FRAGMENT, SKATE, getGameTitle, insert} from '../utils';
import {Link as GatsbyLink} from 'gatsby';
import {Helmet} from 'react-helmet';
import {gql, useMutation} from '@apollo/client';

const UPDATE_GAME = gql`
  mutation UpdateGame($id: ID!, $input: UpdateGameInput!) {
    updateGame(id: $id, input: $input) {
      ...GameFragment
    }
  }
  ${GAME_FRAGMENT}
`;

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

export default function GameForm({game}) {
  const skaterIds = useMemo(
    () => game.skaters.map(skater => skater.id),
    [game.skaters]
  );

  const [roshambos, setRoshambos] = useState(
    // reduce flat array of roshambo rounds into roshambo round format
    // [{[id]: move}]
    Object.values(
      game.roshambos.reduce((acc, roshambo) => {
        const existing = acc[roshambo.round];
        const next = {[roshambo.skater.id]: roshambo.move};
        return {
          ...acc,
          [roshambo.round]: existing ? {...existing, ...next} : next
        };
      }, {})
    )
  );

  const [attempts, setAttempts] = useState(
    game.attempts.reduce(
      (acc, attempt) =>
        attempt.offense
          ? [...acc, attempt]
          : [
              ...acc.slice(0, -1),
              {
                ...acc[acc.length - 1],
                defense: attempt
              }
            ],
      []
    )
  );

  const toast = useToast();

  const [updateGame, {loading}] = useMutation(UPDATE_GAME, {
    onError: error =>
      toast({
        status: 'error',
        title: 'Error saving game',
        description: error.message
      }),
    onCompleted: () =>
      toast({
        status: 'success',
        title: 'Game saved',
        description: 'Your game was saved successfully'
      })
  });

  const [roshamboWinner, isRoshamboTied] = useMemo(() => {
    const lastRound = roshambos[roshambos.length - 1];
    const [p1, p2] = skaterIds.map(skaterId => lastRound?.[skaterId]);

    // if the round is incomplete or a tie return null
    const isTied = p1 === p2;
    if (!p1 || !p2 || isTied) {
      return [null, isTied];
    }

    // check to see if p2 is countering p1 and return the appropriate skater id
    return [skaterIds[Number(ROSHAMBO[p1].counter === p2)], false];
  }, [roshambos, skaterIds]);

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
          skaterIds[1 - skaterIds.indexOf(lastAttempt.skater.id)]
      : roshamboWinner;
    return [offensiveSkater, skaterIds.indexOf(offensiveSkater)];
  }, [attempts, skaterIds, roshamboWinner]);

  const abd = useMemo(
    () =>
      // keep track of tricks that have already been set
      attempts
        .filter(attempt => attempt.successful)
        .map(attempt => attempt.trick.id),
    [attempts]
  );

  const title = useMemo(() => getGameTitle(game), [game]);

  const theadBg = useColorModeValue('white', 'gray.800');

  function setTrick(trick) {
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
    ]);
  }

  return (
    <>
      <Helmet title={title} />
      <Header>
        {title}
        <HStack ml="auto">
          <chakra.span fontSize="sm" color="gray.500">
            Last saved {new Date(game.updatedAt).toLocaleString()}
          </chakra.span>
          <ButtonGroup size="sm">
            <Button
              variant="outline"
              as={GatsbyLink}
              to={`/events/${game.event.id}/edit`}
            >
              Back to event
            </Button>
            <Button
              isLoading={loading}
              colorScheme="green"
              onClick={() =>
                updateGame({
                  variables: {
                    id: game.id,
                    input: {
                      roshambos: roshambos.flatMap((roshambo, index) =>
                        Object.entries(roshambo).map(([skaterId, move]) => ({
                          round: index + 1,
                          move,
                          skaterId
                        }))
                      ),
                      attempts: attempts.flatMap(
                        ({defense, trick, ...offense}) => {
                          return [offense, defense]
                            .filter(Boolean)
                            .map(({skater, successful, redos}, index) => ({
                              successful,
                              redos,
                              offense: !index,
                              skaterId: skater.id,
                              trickId: trick.id
                            }));
                        }
                      )
                    }
                  }
                })
              }
            >
              Save
            </Button>
          </ButtonGroup>
        </HStack>
      </Header>
      <Box px={1} pb={12}>
        <chakra.table
          w="full"
          sx={{
            tableLayout: 'fixed',
            td: {
              px: 2,
              py: 5,
              ':not(:last-child)': {
                textAlign: 'right'
              }
            },
            thead: {
              pos: 'sticky',
              top: HEADER_HEIGHT,
              zIndex: 1,
              bg: theadBg
            }
          }}
        >
          <thead>
            <tr>
              {game.skaters.map((skater, index) => (
                <td key={index}>{skater.fullName}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {roshambos.map((roshambo, index, arr) => (
              <RoshamboButtons
                key={index}
                skaterIds={skaterIds}
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
                  const skaterIndex = skaterIds.indexOf(attempt.skater.id);
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
                        <Stack align={!skaterIndex && 'flex-end'}>
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
                                            id: skaterIds[1 - skaterIndex]
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
                      <Flex>
                        <TrickSelect
                          abd={abd}
                          key={attempts.length}
                          onTrickChange={setTrick}
                        />
                        <CreateTrickButton setTrick={setTrick} />
                      </Flex>
                    </td>
                    {!offensiveSkaterIndex && <td />}
                  </tr>
                )}
              </>
            ) : (
              isRoshamboTied && (
                <RoshamboButtons
                  skaterIds={skaterIds}
                  onChange={play => setRoshambos(prev => [...prev, play])}
                />
              )
            )}
          </tbody>
        </chakra.table>
      </Box>
    </>
  );
}

GameForm.propTypes = {
  game: PropTypes.object.isRequired
};
