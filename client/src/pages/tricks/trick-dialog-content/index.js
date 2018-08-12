import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormDialogContent from '../../../components/form-dialog-content';
import Grid from '@material-ui/core/Grid';
import GridItem from './grid-item';
import PropTypes from 'prop-types';
import React from 'react';
import TrickForm from './trick-form';
import upperFirst from 'lodash/upperFirst';

const TrickDialogContent = props => (
  <FormDialogContent data={props.trick} formComponent={TrickForm}>
    <DialogTitle>{props.trick.name}</DialogTitle>
    <DialogContent>
      <Grid container>
        <GridItem>
          <DialogContentText>Flip: {props.trick.flip}</DialogContentText>
        </GridItem>
        <GridItem>
          <DialogContentText>Shuv: {props.trick.shuv}</DialogContentText>
        </GridItem>
        <GridItem>
          <DialogContentText>Spin: {props.trick.spin}</DialogContentText>
        </GridItem>
        <GridItem>
          <DialogContentText>
            Variation:{' '}
            {props.trick.variation ? upperFirst(props.trick.variation) : 'None'}
          </DialogContentText>
        </GridItem>
      </Grid>
    </DialogContent>
  </FormDialogContent>
);

TrickDialogContent.propTypes = {
  trick: PropTypes.object.isRequired
};

export default TrickDialogContent;
