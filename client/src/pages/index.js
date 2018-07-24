import NotFound from './not-found';
import React from 'react';
import Skaters from './skaters';
import styled from 'react-emotion';
import {Switch, Route} from 'react-router-dom';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto'
});

const Pages = () => (
  <Container>
    <Switch>
      <Route exact component={Skaters} path="/" />
      <Route component={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
