import LoginForm from '../login-form';
import React, {Fragment, useState} from 'react';
import {Button, Dialog} from '@material-ui/core';

export default function LoginButton() {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleClick() {
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClick}>
        Log in
      </Button>
      <Dialog fullWidth maxWidth="xs" open={dialogOpen} onClose={closeDialog}>
        <LoginForm onCancel={closeDialog} />
      </Dialog>
    </Fragment>
  );
}
