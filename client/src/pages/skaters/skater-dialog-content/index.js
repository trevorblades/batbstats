import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterForm from './skater-form';
import {connect} from 'react-redux';

const UNKNOWN = 'unknown';
class SkaterDialogContent extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  state = {
    editing: false
  };

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
          <DialogContentText>
            Record: {this.props.skater.wins}-{this.props.skater.losses}
          </DialogContentText>
          <DialogContentText>
            Age: {this.props.skater.age || UNKNOWN}
          </DialogContentText>
          <DialogContentText>
            Hometown: {this.props.skater.hometown || UNKNOWN}
          </DialogContentText>
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
