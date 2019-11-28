import LoginButton from './login-button';
import React from 'react';
import {Button} from '@material-ui/core';
import {useUser} from '../../utils';

export default function UserStatus() {
  const {user, logOut} = useUser();

  if (user) {
    return (
      <Button variant="outlined" onClick={logOut}>
        Log out
      </Button>
    );
  }

  return <LoginButton />;
}
