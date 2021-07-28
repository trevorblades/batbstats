import PropTypes from 'prop-types';
import React, {useMemo, useState} from 'react';
import isEqual from 'lodash/isEqual';
import sortBy from 'lodash/sortBy';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from '../../assets/logo.svg';
import {gql, useMutation, useQuery} from '@apollo/client';
import {graphql, useStaticQuery} from 'gatsby';

const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      round
      event {
        name
      }
      skaters {
        id
        fullName
      }
      roshambos {
        id
        round
        move
        skater {
          id
        }
      }
    }
  }
`;

const SKATER_FRAGMENT = gql`
  fragment SkaterFragment on Skater {
    id
    fullName
  }
`;

const LIST_SKATERS = gql`
  query ListSkaters {
    skaters {
      ...SkaterFragment
    }
  }
  ${SKATER_FRAGMENT}
`;

function SkaterSelect(props) {
  const {data, loading, error} = useQuery(LIST_SKATERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Select {...props} roundedRight={0}>
      <option>Select a skater</option>
      {sortBy(data.skaters, 'fullName').map(skater => (
        <option key={skater.id} value={skater.id}>
          {skater.fullName}
        </option>
      ))}
    </Select>
  );
}

const CREATE_SKATER = gql`
  mutation CreateSkater($input: SkaterInput!) {
    createSkater(input: $input) {
      ...SkaterFragment
    }
  }
  ${SKATER_FRAGMENT}
`;

function CreateSkaterButton({setSkater}) {
  const {
    countries: {countries}
  } = useStaticQuery(
    graphql`
      {
        countries {
          countries {
            code
            name
            emoji
          }
        }
      }
    `
  );

  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [createSkater, {loading, error}] = useMutation(CREATE_SKATER, {
    onCompleted(data) {
      onClose();
      setSkater(data.createSkater);
      toast({
        status: 'success',
        title: 'New skater created',
        description: `${data.createSkater.fullName} created successfully`
      });
    },
    update(cache, {data}) {
      const queryOptions = {query: LIST_SKATERS};
      const {skaters} = cache.readQuery(queryOptions);
      cache.writeQuery({
        ...queryOptions,
        data: {
          skaters: [...skaters, data.createSkater]
        }
      });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();

    const {firstName, lastName, birthDate, country, stance} = event.target;
    createSkater({
      variables: {
        input: {
          firstName: firstName.value,
          lastName: lastName.value,
          birthDate: birthDate.value || null,
          country: country.value || null,
          stance: stance.value
        }
      }
    });
  }

  return (
    <>
      <Button roundedLeft={0} onClick={onOpen}>
        New skater
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>New skater</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Text mb="4" color="red.500">
                {error.message}
              </Text>
            )}
            <SimpleGrid columns={2} spacing={3}>
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input name="firstName" />
              </FormControl>
              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input name="lastName" />
              </FormControl>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Select name="country">
                  <option value="">Select a country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.emoji} {country.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Birth date</FormLabel>
                <Input type="date" name="birthDate" />
              </FormControl>
              <FormControl>
                <FormLabel>Stance</FormLabel>
                <RadioGroup name="stance" defaultValue="regular">
                  <HStack spacing={5}>
                    <Radio value="regular">Regular</Radio>
                    <Radio value="goofy">Goofy</Radio>
                  </HStack>
                </RadioGroup>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button mr="3" onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={loading} colorScheme="blue" type="submit">
              Save skater
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

CreateSkaterButton.propTypes = {
  setSkater: PropTypes.func.isRequired
};

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

function RoshamboButtons({round, skaters, onChange}) {
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

function GameForm({defaultSkaters = [null, null], defaultRoshambos = []}) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  const [roshambos, setRoshambos] = useState(defaultRoshambos);

  const isRoshamboTied =
    roshambos.length === 0 ||
    isEqual(...Object.values(roshambos[roshambos.length - 1]));

  function setSkater(skater, index) {
    setSkaters(prev => [
      ...prev.slice(0, index),
      skater,
      ...prev.slice(index + 1)
    ]);
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

export default function Game({params}) {
  const {data, loading, error} = useQuery(GET_GAME, {
    variables: {id: params.id}
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data.game) {
    return <div>Game not found</div>;
  }

  const {round, event, skaters, roshambos} = data.game;
  const title = `${event.name}: Round ${round}`;

  return (
    <>
      <Helmet title={title} />
      <Flex align="center" px={4} py={2}>
        <Box as={Logo} mr="3" boxSize={6} fill="current" />
        {title}
      </Flex>
      <GameForm
        defaultSkaters={skaters.map(skater => skater.id)}
        defaultRoshambos={Object.values(
          roshambos.reduce((acc, roshambo) => {
            const existing = acc[roshambo.round];
            const next = {[roshambo.skater.id]: roshambo.move};
            return {
              ...acc,
              [roshambo.round]: existing ? {...existing, ...next} : next
            };
          }, {})
        )}
      />
    </>
  );
}

Game.propTypes = {
  params: PropTypes.object
};
