import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormDialogContent from '../../../components/form-dialog-content';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import SkaterForm from './skater-form';
import differenceInYears from 'date-fns/differenceInYears';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';

const GridItem = withProps({
  item: true,
  xs: true
})(Grid);

const UNKNOWN = 'unknown';
const SkaterDialogContent = props => (
  <FormDialogContent data={props.skater} formComponent={SkaterForm}>
    <DialogTitle>{props.skater.full_name}</DialogTitle>
    <DialogContent>
      <Grid container spacing={theme.spacing.unit * 2}>
        <GridItem>
          <DialogContentText>
            Record: {props.skater.wins}-{props.skater.losses}
          </DialogContentText>
          <DialogContentText>
            Hometown: {props.skater.hometown || UNKNOWN}
          </DialogContentText>
        </GridItem>
        <GridItem>
          <DialogContentText>
            Stance: {props.skater.stance || UNKNOWN}
          </DialogContentText>
          <DialogContentText>
            Age:{' '}
            {props.skater.birth_date
              ? differenceInYears(Date.now(), props.skater.birth_date)
              : UNKNOWN}
          </DialogContentText>
        </GridItem>
      </Grid>
    </DialogContent>
  </FormDialogContent>
);

SkaterDialogContent.propTypes = {
  skater: PropTypes.object.isRequired
};

export default SkaterDialogContent;
