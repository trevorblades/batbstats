import CssBaseline from '@material-ui/core/CssBaseline';
import Helmet from 'react-helmet';
import Pages from '../pages';
import React, {Fragment} from 'react';
import Sidebar from './sidebar';
import styled from 'react-emotion';
import {hot} from 'react-hot-loader';

const Container = styled.div({
  display: 'flex',
  height: '100%'
});

const App = () => (
  <Fragment>
    <Helmet defaultTitle={TITLE} titleTemplate={`%s · ${TITLE}`} />
    <CssBaseline />
    <Container>
      <Sidebar />
      <Pages />
    </Container>
  </Fragment>
);

export default hot(module)(App);
