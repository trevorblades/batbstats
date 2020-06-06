import GameForm from './game-form';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {Box, Button, Dialog} from '@material-ui/core';
import {useUser} from '../../utils';

export default function EditGameButton(props) {
  const {user} = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) {
    return null;
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  return (
    <>
      <Box component={Button} mr={1} onClick={() => setDialogOpen(true)}>
        Edit game
      </Box>
      <Dialog fullWidth open={dialogOpen} onClose={closeDialog}>
        <GameForm
          title={props.title}
          game={props.game}
          closeDialog={closeDialog}
        />
      </Dialog>
    </>
  );
}

EditGameButton.propTypes = {
  title: PropTypes.string.isRequired,
  game: PropTypes.object.isRequired
};
