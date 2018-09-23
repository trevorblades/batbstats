import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormField from './form-field';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {logIn} from '../actions/user';

class LoginForm extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  onSubmit = event => {
    event.preventDefault();
    this.props.dispatch(
      logIn([event.target.email.value, event.target.password.value])
    );
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>Log in</DialogTitle>
        <DialogContent>
          <FormField autoFocus label="Email" name="email" />
          <FormField label="Password" name="password" type="password" />
        </DialogContent>
        <DialogActions>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  error: state.user.error,
  loading: state.user.loading
});

export default connect(mapStateToProps)(LoginForm);
