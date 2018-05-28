import Paper from '@material-ui/core/Paper';
import React from 'react';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './dashboard';
import NotFound from './not-found';
import Skaters from './skaters';
import Skater from './skater';

const Container = withProps({square: true})(
  styled(Paper)({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto'
  })
);

const Pages = () => (
  <Container>
    <Switch>
      <Route exact component={Dashboard} path="/" />
      <Route exact component={Skaters} path="/skaters" />
      <Route exact component={Skater} path="/skaters/:id/:view?" />
      <Route component={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
