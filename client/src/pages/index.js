import About from './about';
import NotFound from './not-found';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Skaters from './skaters';
import Tricks from './tricks';
import TrickDistribution from './trick-distribution';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {Switch, Route} from 'react-router-dom';

const Container = withProps({
  elevation: 0,
  square: true
})(
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
      <Route exact component={About} path="/" />
      <Route exact component={Skaters} path="/skaters" />
      <Route exact component={Tricks} path="/tricks" />
      <Route component={TrickDistribution} path="/trick-distribution" />
      <Route component={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
