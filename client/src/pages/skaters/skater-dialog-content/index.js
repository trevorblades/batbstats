import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterForm from './skater-form';

const UNKNOWN = 'unknown';
class SkaterDialogContent extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired
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
            Age: {this.props.skater.age || UNKNOWN}
          </DialogContentText>
          <DialogContentText>
            Hometown: {this.props.skater.hometown || UNKNOWN}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onEditClick}>Edit skater</Button>
        </DialogActions>
      </Fragment>
    );
  }
}

export default SkaterDialogContent;
