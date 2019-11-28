import LoginButton from './login-button';
import React from 'react';
import {Button} from '@material-ui/core';
import {gql, useQuery} from '@apollo/client';

const GET_USER = gql`
  {
    user @client(always: true) {
      email
    }
  }
`;

export default function UserStatus() {
  const {data, client} = useQuery(GET_USER);

  function logOut() {
    localStorage.removeItem('token');
    client.resetStore();
  }

  if (data && data.user) {
    return (
      <Button variant="outlined" onClick={logOut}>
        Log out
      </Button>
    );
  }

  return <LoginButton />;
}
