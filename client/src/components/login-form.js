import PropTypes from 'prop-types';
import React from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import {gql, useMutation} from '@apollo/client';
import {userFromToken} from '../utils';

const LOG_IN = gql`
  mutation LogIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password)
  }
`;

function FormField(props) {
  return (
    <TextField
      fullWidth
      margin="normal"
      required
      variant="outlined"
      {...props}
    />
  );
}

export default function LoginForm(props) {
  const [logIn, {loading, error}] = useMutation(LOG_IN, {
    update(cache, {data}) {
      localStorage.setItem('token', data.logIn);
      cache.writeData({
        data: {
          user: userFromToken(data.logIn)
        }
      });
    }
  });

  function handleSubmit(event) {
    event.preventDefault();

    const {email, password} = event.target;
    logIn({
      variables: {
        email: email.value,
        password: password.value
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Log in</DialogTitle>
      <DialogContent>
        {error && (
          <DialogContentText color="error">{error.message}</DialogContentText>
        )}
        <FormField autoFocus label="Email address" type="email" name="email" />
        <FormField label="Password" type="password" name="password" />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button disabled={loading} color="primary" type="submit">
          Submit
        </Button>
      </DialogActions>
    </form>
  );
}

LoginForm.propTypes = {
  onCancel: PropTypes.func.isRequired
};
