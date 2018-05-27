import PropTypes from 'prop-types';
import React, {Component} from 'react';
import compose from 'recompose/compose';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import {load as loadSkaters} from '../actions/skaters';
import theme from '../theme';
import Header from './header';
import Sidebar from './sidebar';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
});

const InnerContainer = styled.div({
  display: 'flex',
  flexGrow: 1
});

const Content = styled.div({
  flexGrow: 1,
  backgroundColor: theme.palette.grey[50]
});

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadSkaters());
  }

  render() {
    return (
      <Container>
        <Header />
        <InnerContainer>
          <Sidebar />
          <Content />
        </InnerContainer>
      </Container>
    );
  }
}

export default compose(hot(module), connect())(App);
