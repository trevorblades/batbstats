import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import {LIST_TRICKS, TRICK_FRAGMENT} from '../utils';
import {gql, useMutation} from '@apollo/client';

const CREATE_TRICK = gql`
  mutation CreateTrick($input: TrickInput!) {
    createTrick(input: $input) {
      ...TrickFragment
    }
  }
  ${TRICK_FRAGMENT}
`;

export default function CreateTrickButton({setTrick}) {
  const toast = useToast();
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [createTrick, {loading, error}] = useMutation(CREATE_TRICK, {
    onCompleted(data) {
      onClose();
      setTrick(data.createTrick);
      toast({
        status: 'success',
        title: 'New trick created',
        description: `${data.createTrick.name} created successfully`
      });
    },
    update(cache, {data}) {
      const queryOptions = {query: LIST_TRICKS};
      const {tricks} = cache.readQuery(queryOptions);
      cache.writeQuery({
        ...queryOptions,
        data: {
          tricks: [...tricks, data.createTrick]
        }
      });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();
    createTrick({
      variables: {
        input: {
          name: event.target.name.value
        }
      }
    });
  }

  return (
    <>
      <Button flexShrink={0} roundedLeft={0} onClick={onOpen}>
        New trick
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit}>
          <ModalHeader>New trick</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Text mb="4" color="red.500">
                {error.message}
              </Text>
            )}
            <FormControl isRequired>
              <FormLabel>Trick name</FormLabel>
              <Input name="name" autoFocus />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button mr="3" onClick={onClose}>
              Cancel
            </Button>
            <Button isLoading={loading} colorScheme="blue" type="submit">
              Save trick
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

CreateTrickButton.propTypes = {
  setTrick: PropTypes.func.isRequired
};
