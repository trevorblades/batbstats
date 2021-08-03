import CreateGameForm from './CreateGameForm';
import PropTypes from 'prop-types';
import React from 'react';
import {AddIcon} from '@chakra-ui/icons';
import {Button, Modal, ModalOverlay, useDisclosure} from '@chakra-ui/react';

export default function CreateGameButton({eventId}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  return (
    <>
      <Button
        leftIcon={<AddIcon />}
        colorScheme="green"
        size="sm"
        ml="auto"
        onClick={onOpen}
      >
        New game
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <CreateGameForm onClose={onClose} eventId={eventId} />
      </Modal>
    </>
  );
}

CreateGameButton.propTypes = {
  eventId: PropTypes.string.isRequired
};
