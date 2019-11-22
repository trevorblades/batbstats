import Degrees from '../degrees';
import PropTypes from 'prop-types';
import React, {Fragment, useState} from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TableCell,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import {gql, useMutation} from '@apollo/client';

export const TRICK_FRAGMENT = gql`
  fragment TrickFragment on Trick {
    id
    name
    flip
    shuv
    spin
  }
`;

const UPDATE_TRICK = gql`
  mutation UpdateTrick(
    $id: ID!
    $name: String
    $flip: Int
    $shuv: Int
    $spin: Int
  ) {
    updateTrick(id: $id, name: $name, flip: $flip, shuv: $shuv, spin: $spin) {
      ...TrickFragment
    }
  }
  ${TRICK_FRAGMENT}
`;

function FormField(props) {
  return <TextField fullWidth required margin="normal" {...props} />;
}

export default function TrickRow(props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const {id, name, flip, spin, shuv} = props.trick;
  const [updateTrick, {loading, error}] = useMutation(UPDATE_TRICK, {
    variables: {id}
  });

  function handleClick() {
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const {name, flip, spin, shuv} = event.target;
    updateTrick({
      variables: {
        name: name.value,
        flip: Number(flip.value),
        spin: Number(spin.value),
        shuv: Number(shuv.value)
      }
    });
  }

  return (
    <Fragment>
      <TableRow hover onClick={handleClick}>
        <TableCell padding="none">{name}</TableCell>
        <TableCell align="right">{flip}</TableCell>
        <TableCell align="right">
          <Degrees value={spin} />
        </TableCell>
        <TableCell align="right">
          <Degrees value={shuv} />
        </TableCell>
      </TableRow>
      <Dialog fullWidth open={dialogOpen} onClose={closeDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Editing &ldquo;{name}&rdquo;</DialogTitle>
          <DialogContent>
            {error && (
              <Typography gutterBottom color="error">
                {error.message}
              </Typography>
            )}
            <FormField name="name" label="Trick name" defaultValue={name} />
            <Grid container>
              <Grid item xs={4}>
                <FormField
                  label="Flip count"
                  name="flip"
                  defaultValue={flip}
                  type="number"
                />
              </Grid>
              <Grid item xs={4}>
                <FormField
                  label="Spin count"
                  name="spin"
                  defaultValue={spin}
                  type="number"
                />
              </Grid>
              <Grid item xs={4}>
                <FormField
                  label="Shuv count"
                  name="shuv"
                  defaultValue={shuv}
                  type="number"
                />
              </Grid>
            </Grid>
            <Box mt={2}>
              <Typography color="textSecondary" variant="body2">
                Note: One unit of spin/shuv is equal to 180&deg;. Frontside
                spins/shuvs are negative, and backside is positive. For example,
                a BS 360 would have a spin value of 2.
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button color="primary" type="submit" disabled={loading}>
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

TrickRow.propTypes = {
  trick: PropTypes.object.isRequired
};
