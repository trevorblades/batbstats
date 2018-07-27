import CssBaseline from '@material-ui/core/CssBaseline';
import Helmet from 'react-helmet';
import Pages from '../pages';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import ReactGA from 'react-ga';
import Sidebar from './sidebar';
import compose from 'recompose/compose';
import styled from 'react-emotion';
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

  componentDidMount() {
    ReactGA.pageview(this.props.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      ReactGA.pageview(this.props.location.pathname);
    }
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

export default compose(hot(module), withRouter)(App);
