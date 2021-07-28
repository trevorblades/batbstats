import PropTypes from 'prop-types';
import React, {useState} from 'react';
import sortBy from 'lodash/sortBy';
import {
  Box,
  Button,
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
  useDisclosure
} from '@chakra-ui/react';
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

const LIST_SKATERS = gql`
  query ListSkaters {
    skaters {
      id
      fullName
    }
  }
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
      id
      fullName
    }
  }
`;

function NewSkaterButton() {
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

  const {isOpen, onOpen, onClose} = useDisclosure();

  const [createSkater, {loading, error}] = useMutation(CREATE_SKATER);

  function handleSubmit(event) {
    event.preventDefault();
    createSkater({
      variables: {
        input: Object.fromEntries(new FormData(event.target))
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

function GameForm({defaultSkaters = [null, null]}) {
  const [skaters, setSkaters] = useState(defaultSkaters);
  return (
    <SimpleGrid columns={2} spacing={6} p={6}>
      {skaters.map((skater, index) => (
        <Flex key={index}>
          <SkaterSelect
            value={skater}
            onChange={event =>
              setSkaters(prev => [
                ...prev.slice(0, index),
                event.target.value,
                ...prev.slice(index + 1)
              ])
            }
          />
          <NewSkaterButton />
        </Flex>
      ))}
    </SimpleGrid>
  );
}

GameForm.propTypes = {
  defaultSkaters: PropTypes.array
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

  const {round, event, skaters} = data.game;

  return (
    <>
      <Box px={4} py={2}>
        {event.name} Round {round}
      </Box>
      <GameForm defaultSkaters={skaters.map(skater => skater.id)} />
    </>
  );
}

Game.propTypes = {
  params: PropTypes.object
};
