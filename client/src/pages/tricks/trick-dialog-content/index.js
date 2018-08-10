import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import React from 'react';
import FormDialogContent from '../../../components/form-dialog-content';
import TrickForm from './trick-form';

const TrickDialogContent = props => (
  <FormDialogContent data={props.trick} formComponent={TrickForm}>
    <DialogTitle>Hello</DialogTitle>
    <DialogContent>
      <DialogContentText>jldfakjkaldfs</DialogContentText>
    </DialogContent>
  </FormDialogContent>
);

TrickDialogContent.propTypes = {
  trick: PropTypes.object.isRequired
};

export default TrickDialogContent;
