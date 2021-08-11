import CreateSkaterForm from './CreateSkaterForm';
import PropTypes from 'prop-types';
import React, {Fragment, useState} from 'react';
import SkaterSelect from './SkaterSelect';
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text
} from '@chakra-ui/react';
import {GAME_FRAGMENT, GET_EVENT, insert} from '../utils';
import {gql, useMutation} from '@apollo/client';
import {navigate} from 'gatsby';

const CREATE_GAME = gql`
  mutation CreateGame($input: CreateGameInput!) {
    createGame(input: $input) {
      ...GameFragment
    }
  }
  ${GAME_FRAGMENT}
`;

export default function CreateGameForm({eventId, onClose}) {
  const [round, setRound] = useState(1);
  const [skaterIds, setSkaterIds] = useState(Array(2).fill(''));
  const [newSkaterIndex, setNewSkaterIndex] = useState(-1);
  const [replacements, setReplacements] = useState([]);

  const [createGame, {loading, error}] = useMutation(CREATE_GAME, {
    onCompleted: data => navigate(`/games/${data.createGame.id}/edit`),
    update(cache, {data}) {
      const queryOptions = {
        query: GET_EVENT,
        variables: {
          id: data.createGame.event.id
        }
      };
      const {event, events} = cache.readQuery(queryOptions);
      cache.writeQuery({
        ...queryOptions,
        data: {
          events,
          event: {
            ...event,
            games: [...event.games, data.createGame]
          }
        }
      });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();

    createGame({
      variables: {
        input: {
          round,
          eventId,
          skaters: skaterIds,
          // map replacements in/out to their appropriate column name
          replacements: replacements.map(replacement => ({
            inId: replacement.in,
            outId: replacement.out
          }))
        }
      }
    });
  }

  if (newSkaterIndex > -1) {
    return (
      <CreateSkaterForm
        onClose={() => setNewSkaterIndex(-1)}
        onSkaterCreate={skater =>
          setSkaterIds(prev => insert(prev, newSkaterIndex, skater.id))
        }
      />
    );
  }

  return (
    <ModalContent as="form" onSubmit={handleSubmit}>
      <ModalHeader>New game</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {error && (
          <Text mb="4" color="red.500">
            {error.message}
          </Text>
        )}
        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Round</FormLabel>
            <NumberInput
              min={1}
              value={round}
              onChange={(_, valueAsNumber) => setRound(valueAsNumber)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
          {skaterIds.map((skaterId, index, array) => {
            const replacement = replacements.find(
              replacement => replacement.in === skaterId
            );
            const opponent = array[1 - index];
            return (
              <Fragment key={index}>
                <FormControl isRequired>
                  <FormLabel>Skater {index + 1}</FormLabel>
                  <Flex>
                    <SkaterSelect
                      selected={[
                        opponent,
                        ...replacements.map(replacement => replacement.out)
                      ]}
                      roundedRight={0}
                      value={skaterId}
                      onChange={event =>
                        setSkaterIds(prev =>
                          insert(prev, index, event.target.value)
                        )
                      }
                    />
                    <Button
                      flexShrink={0}
                      roundedLeft={0}
                      onClick={() => setNewSkaterIndex(index)}
                    >
                      New skater
                    </Button>
                  </Flex>
                </FormControl>
                {skaterId && (
                  <>
                    <Checkbox
                      isChecked={Boolean(replacement)}
                      onChange={event =>
                        setReplacements(prev =>
                          event.target.checked
                            ? [...prev, {in: skaterId, out: ''}]
                            : prev.filter(
                                replacement => replacement.in !== skaterId
                              )
                        )
                      }
                    >
                      Is this skater a replacement?
                    </Checkbox>
                    {replacement && (
                      <FormControl isRequired>
                        <FormLabel>Who are they replacing?</FormLabel>
                        <SkaterSelect
                          selected={replacements
                            .filter(replacement => replacement.in === opponent)
                            .map(replacement => replacement.out)
                            .concat(skaterIds)}
                          value={replacement.out}
                          onChange={event =>
                            setReplacements(prev =>
                              prev.map(replacement =>
                                replacement.in === skaterId
                                  ? {...replacement, out: event.target.value}
                                  : replacement
                              )
                            )
                          }
                        />
                      </FormControl>
                    )}
                  </>
                )}
              </Fragment>
            );
          })}
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button mr="3" onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={loading} colorScheme="blue" type="submit">
          Save game
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

CreateGameForm.propTypes = {
  eventId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};
