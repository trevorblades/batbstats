import CssBaseline from '@material-ui/core/CssBaseline';
import Helmet from 'react-helmet';
import React, {Fragment} from 'react';
import styled from 'react-emotion';
import {hot} from 'react-hot-loader';
import Pages from '../pages';
import Sidebar from './sidebar';

const Container = styled.div({
  display: 'flex',
  height: '100%'
});

const App = () => (
  <Fragment>
    <Helmet
      defaultTitle={process.env.TITLE}
      titleTemplate={`%s · ${process.env.TITLE}`}
    />
    <CssBaseline />
    <Container>
      <Sidebar />
      <Pages />
    </Container>
  </Fragment>
);

export default hot(module)(App);
