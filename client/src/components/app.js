import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import compose from 'recompose/compose';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import {load as loadSkaters} from '../actions/skaters';
import Header from './header';

class App extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadSkaters());
  }

  render() {
    return (
      <Fragment>
        <Header />
        <div>hello</div>
      </Fragment>
    );
  }
}

export default compose(hot(module), connect())(App);
