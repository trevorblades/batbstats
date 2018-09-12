import About from './about';
import Events from './events';
import Game from './game';
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
      <Route exact path="/" component={About} />
      <Route exact path="/events" component={Events} />
      <Route exact path="/skaters" component={Skaters} />
      <Route exact path="/tricks" component={Tricks} />
      <Route exact path="/games/:id" component={Game} />
      <Route path="/trick-distribution" component={TrickDistribution} />
      <Route component={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
