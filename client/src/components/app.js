import Pages from '../pages';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactGA from 'react-ga';
import Sidebar from './sidebar';
import compose from 'recompose/compose';
import store from 'store';
import styled from 'react-emotion';
import {Provider} from '../user-context';
import {TOKEN_KEY} from '../constants';
import {hot} from 'react-hot-loader';
import {withRouter} from 'react-router-dom';

const Container = styled.div({
  display: 'flex',
  height: '100%'
});

class App extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  state = {
    token: store.get(TOKEN_KEY)
  };

  async componentDidMount() {
    ReactGA.pageview(this.props.location.pathname);
    if (this.state.token) {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${this.state.token}`);
      const response = await fetch(`${API_URL}/auth/renew`, {headers});
      if (response.ok) {
        const token = await response.text();
        this.setToken(token);
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      ReactGA.pageview(this.props.location.pathname);
    }
  }

  setToken = token => this.setState({token}, () => store.set(TOKEN_KEY, token));

  render() {
    return (
      <Provider
        value={{
          token: this.state.token,
          setToken: this.setToken
        }}
      >
        <Container>
          <Sidebar />
          <Pages />
        </Container>
      </Provider>
    );
  }
}

export default compose(hot(module), withRouter)(App);
