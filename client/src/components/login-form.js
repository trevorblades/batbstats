import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import api from '../api';
import {FormField} from '.';
import {withUser} from '../user-context';

class LoginForm extends Component {
  static propTypes = {
    setToken: PropTypes.func.isRequired
  };

  state = {
    loading: false,
    error: null
  };

  onSubmit = async event => {
    event.preventDefault();
    this.setState({loading: true});

    const response = await api
      .auth(event.target.email.value, event.target.password.value)
      .post('/auth');
    if (response.err) {
      this.setState({
        loading: false,
        error: response.err
      });
      return;
    }

    this.props.setToken(response.body);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>Log in</DialogTitle>
        <DialogContent>
          {this.state.error && this.state.error.message}
          <FormField autoFocus label="Email" name="email" />
          <FormField label="Password" name="password" type="password" />
        </DialogContent>
        <DialogActions>
          <Button disabled={this.state.loading} type="submit" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    );
  }
}

export default withUser(LoginForm);
