import PropTypes from 'prop-types';
import React from 'react';
import VariationsSelect from './variations-select';
import {
  Box,
  Button,
  Checkbox,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
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
    variation
    other
  }
`;

const UPDATE_TRICK = gql`
  mutation UpdateTrick(
    $id: ID!
    $name: String
    $flip: Int
    $shuv: Int
    $spin: Int
    $variation: Variation
    $other: Boolean
  ) {
    updateTrick(
      id: $id
      name: $name
      flip: $flip
      shuv: $shuv
      spin: $spin
      variation: $variation
      other: $other
    ) {
      ...TrickFragment
    }
  }
  ${TRICK_FRAGMENT}
`;

function FormField(props) {
  return <TextField fullWidth required margin="normal" {...props} />;
}

export default function TrickForm(props) {
  const [updateTrick, {loading, error}] = useMutation(UPDATE_TRICK, {
    onCompleted: props.onCancel,
    variables: {
      id: props.trick.id
    }
  });

  function handleSubmit(event) {
    event.preventDefault();

    const {name, flip, spin, shuv, variation, other} = event.target;
    updateTrick({
      variables: {
        name: name.value,
        flip: Number(flip.value),
        spin: Number(spin.value),
        shuv: Number(shuv.value),
        variation: variation.value || null,
        other: other.checked
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>Editing &ldquo;{props.trick.name}&rdquo;</DialogTitle>
      <DialogContent>
        {error && (
          <DialogContentText color="error">{error.message}</DialogContentText>
        )}
        <FormField
          name="name"
          label="Trick name"
          defaultValue={props.trick.name}
        />
        <Grid container>
          <Grid item xs={4}>
            <FormField
              label="Flip count"
              name="flip"
              defaultValue={props.trick.flip}
              type="number"
            />
          </Grid>
          <Grid item xs={4}>
            <FormField
              label="Spin count"
              name="spin"
              defaultValue={props.trick.spin}
              type="number"
            />
          </Grid>
          <Grid item xs={4}>
            <FormField
              label="Shuv count"
              name="shuv"
              defaultValue={props.trick.shuv}
              type="number"
            />
          </Grid>
        </Grid>
        <VariationsSelect defaultValue={props.trick.variation} />
        <FormControlLabel
          control={<Checkbox name="other" defaultChecked={props.trick.other} />}
          label="Trick is unconventional"
        />
        <Box mt={2}>
          <Typography color="textSecondary" variant="body2">
            Note: One unit of spin/shuv is equal to 180&deg;. Frontside
            spins/shuvs are negative, and backside is positive. For example, a
            BS 360 would have a spin value of 2.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>Cancel</Button>
        <Button color="primary" type="submit" disabled={loading}>
          Save changes
        </Button>
      </DialogActions>
    </form>
  );
}

TrickForm.propTypes = {
  trick: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired
};
