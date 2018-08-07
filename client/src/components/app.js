import Pages from '../pages';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactGA from 'react-ga';
import Sidebar from './sidebar';
import compose from 'recompose/compose';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import {renewToken} from '../actions/user';
import {withRouter} from 'react-router-dom';

const Container = styled.div({
  display: 'flex',
  height: '100%'
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    user: PropTypes.object
  };

  componentDidMount() {
    ReactGA.pageview(this.props.location.pathname);
    if (this.props.user) {
      this.props.dispatch(renewToken(this.props.user.token));
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      ReactGA.pageview(this.props.location.pathname);
    }
  }

  render() {
    return (
      <Container>
        <Sidebar />
        <Pages />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

export default compose(hot(module), withRouter, connect(mapStateToProps))(App);
