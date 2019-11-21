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

function FormField(props) {
  return <TextField fullWidth required margin="normal" {...props} />;
}

export default function TrickRow(props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleClick() {
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(event.target);
  }

  const {name, flip, spin, shuv} = props.trick;
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
            <Button color="primary" type="submit">
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
