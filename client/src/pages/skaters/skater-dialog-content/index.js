import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterForm from './skater-form';
import differenceInYears from 'date-fns/differenceInYears';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';

const GridItem = withProps({
  item: true,
  xs: true
})(Grid);

const UNKNOWN = 'unknown';

class SkaterDialogContent extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  state = {
    editing: false
  };

  componentDidUpdate(prevProps) {
    if (this.props.skater !== prevProps.skater) {
      this.stopEditing();
    }
  }

  onEditClick = () => this.setState({editing: true});

  stopEditing = () => this.setState({editing: false});

  render() {
    if (this.state.editing) {
      return (
        <SkaterForm skater={this.props.skater} onCancel={this.stopEditing} />
      );
    }

    return (
      <Fragment>
        <DialogTitle>{this.props.skater.full_name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={theme.spacing.unit * 2}>
            <GridItem>
              <DialogContentText>
                Record: {this.props.skater.wins}-{this.props.skater.losses}
              </DialogContentText>
              <DialogContentText>
                Hometown: {this.props.skater.hometown || UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Stance: {this.props.skater.stance || UNKNOWN}
              </DialogContentText>
              <DialogContentText>
                Age:{' '}
                {this.props.skater.birth_date
                  ? differenceInYears(Date.now(), this.props.skater.birth_date)
                  : UNKNOWN}
              </DialogContentText>
            </GridItem>
          </Grid>
        </DialogContent>
        {this.props.user && (
          <DialogActions>
            <Button onClick={this.onEditClick}>Edit skater</Button>
          </DialogActions>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

export default connect(mapStateToProps)(SkaterDialogContent);
