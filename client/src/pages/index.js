import About from './about';
import Event from './event';
import Events from './events';
import Game from './game';
import NotFound from './not-found';
import React from 'react';
import Skater from './skater';
import Skaters from './skaters';
import Trick from './trick';
import Tricks from './tricks';
import styled from 'react-emotion';
import {Route, Switch} from 'react-router-dom';

const Container = styled.main({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'auto'
});

const Pages = () => (
  <Container square elevation={0}>
    <Switch>
      <Route exact path="/" render={About} />
      <Route exact path="/events" render={Events} />
      <Route exact path="/events/:id" render={Event} />
      <Route exact path="/skaters" render={Skaters} />
      <Route exact path="/skaters/:id" render={Skater} />
      <Route exact path="/tricks" render={Tricks} />
      <Route exact path="/tricks/:id" render={Trick} />
      <Route exact path="/games/:id" render={Game} />
      <Route render={NotFound} />
    </Switch>
  </Container>
);

export default Pages;
