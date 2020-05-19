import Degrees from '../degrees';
import PropTypes from 'prop-types';
import React, {useState} from 'react';
import TrickForm from './trick-form';
import {Dialog, TableCell, TableRow} from '@material-ui/core';

export default function TrickRow(props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function handleClick() {
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  return (
    <>
      <TableRow hover onClick={handleClick}>
        <TableCell padding="none">{props.trick.name}</TableCell>
        <TableCell align="right">{props.trick.flip}</TableCell>
        <TableCell align="right">
          <Degrees value={props.trick.spin} />
        </TableCell>
        <TableCell align="right">
          <Degrees value={props.trick.shuv} />
        </TableCell>
      </TableRow>
      <Dialog fullWidth open={dialogOpen} onClose={closeDialog}>
        <TrickForm trick={props.trick} onCancel={closeDialog} />
      </Dialog>
    </>
  );
}

TrickRow.propTypes = {
  trick: PropTypes.object.isRequired
};
