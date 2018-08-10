import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormField from '../../../components/form-field';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

class TrickForm extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  onSubmit = event => {
    event.preventDefault();
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>Editing {this.props.data.name}</DialogTitle>
        <DialogContent>
          <FormField
            defaultValue={this.props.data.name}
            label="Name"
            name="name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onCancel}>Cancel</Button>
          <Button onClick={this.onSubmit} color="primary" type="submit">
            Save changes
          </Button>
        </DialogActions>
      </form>
    );
  }
}

export default TrickForm;
