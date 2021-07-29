import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
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
import {LIST_SKATERS, SKATER_FRAGMENT} from '../utils';
import {gql, useMutation} from '@apollo/client';
import {graphql, useStaticQuery} from 'gatsby';

const CREATE_SKATER = gql`
  mutation CreateSkater($input: SkaterInput!) {
    createSkater(input: $input) {
      ...SkaterFragment
    }
  }
  ${SKATER_FRAGMENT}
`;

export default function CreateSkaterButton({setSkater}) {
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
      <Button flexShrink={0} roundedLeft={0} onClick={onOpen}>
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
