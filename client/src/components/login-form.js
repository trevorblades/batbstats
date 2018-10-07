import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
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

    const headers = new Headers();
    headers.append(
      'Authorization',
      `Basic ${Buffer.from(
        [event.target.email.value, event.target.password.value].join(':')
      ).toString('base64')}`
    );

    const response = await fetch(`${API_URL}/auth`, {headers});
    if (!response.ok) {
      this.setState({
        loading: false,
        error: new Error(response.statusText)
      });
      return;
    }

    const token = await response.text();
    this.props.setToken(token);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>Log in</DialogTitle>
        <DialogContent>
          {this.state.error && (
            <Typography color="error">Invalid email/password</Typography>
          )}
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
