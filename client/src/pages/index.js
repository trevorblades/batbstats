import About from './about';
import Event from './event';
import Events from './events';
import Game from './game';
import NotFound from './not-found';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import Skater from './skater';
import Skaters from './skaters';
import Trick from './trick';
import Tricks from './tricks';
import styled from 'react-emotion';
import {Route, Switch} from 'react-router-dom';

const Container = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto'
});

const Pages = () => (
  <Container square elevation={0}>
    <Switch>
      <Route exact path="/" component={About} />
      <Route exact path="/events" component={Events} />
      <Route exact path="/events/:id" component={Event} />
      <Route exact path="/skaters" component={Skaters} />
      <Route exact path="/skaters/:id" component={Skater} />
      <Route exact path="/tricks" component={Tricks} />
      <Route exact path="/tricks/:id" component={Trick} />
      <Route exact path="/games/:id" component={Game} />
      <Route component={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
