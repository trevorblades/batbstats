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

const UPDATE_GAME = gql`
  mutation UpdateGame($input: UpdateGameInput!) {
    updateGame(input: $input) {
      id
    }
  }
`;

export default function GameForm(props) {
  const [updateGame, {loading, error}] = useMutation(UPDATE_GAME, {
    onCompleted: props.closeDialog
  });

  function handleSubmit(event) {
    event.preventDefault();

    updateGame({
      variables: {
        input: {
          id: props.game.id,
          date: event.target.date.value
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        {error && (
          <DialogContentText color="error">{error.message}</DialogContentText>
        )}
        <TextField
          type="date"
          name="date"
          label="Date of game"
          defaultValue={props.game.date}
          InputLabelProps={{
            shrink: true
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeDialog}>Cancel</Button>
        <Button type="submit" disabled={loading}>
          Save changes
        </Button>
      </DialogActions>
    </form>
  );
}

GameForm.propTypes = {
  game: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  closeDialog: PropTypes.func.isRequired
};
