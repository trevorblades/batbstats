import CssBaseline from '@material-ui/core/CssBaseline';
import Helmet from 'react-helmet';
import Pages from '../pages';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Sidebar from './sidebar';
import compose from 'recompose/compose';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import {withRouter} from 'react-router-dom';
import {load as loadGames} from '../actions/games';

const Container = styled.div({
  display: 'flex',
  height: '100%'
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadGames());
  }

  render() {
    return (
      <Fragment>
        <Helmet defaultTitle={TITLE} titleTemplate={`%s · ${TITLE}`} />
        <CssBaseline />
        <Container>
          <Sidebar />
          <Pages />
        </Container>
      </Fragment>
    );
  }
}

export default compose(hot(module), withRouter, connect())(App);
