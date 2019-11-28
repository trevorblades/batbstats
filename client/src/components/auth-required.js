import LoginForm from './login-form';
import PropTypes from 'prop-types';
import React from 'react';
import {Box} from '@material-ui/core';
import {useUser} from '../utils';

export default function AuthRequired(props) {
  const {user} = useUser();

  if (!user) {
    return (
      <Box height="100vh" display="flex">
        <Box
          m="auto"
          border={1}
          borderColor="divider"
          bgcolor="background.paper"
          borderRadius="borderRadius"
        >
          <LoginForm />
        </Box>
      </Box>
    );
  }

  return props.children;
}

AuthRequired.propTypes = {
  children: PropTypes.node.isRequired
};
