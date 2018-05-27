import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './dashboard';
import NotFound from './not-found';
import Skater from './skater';

const Pages = () => (
  <Switch>
    <Route exact component={Dashboard} path="/" />
    <Route exact component={Skater} path="/skaters/:id" />
    <Route component={NotFound} />
  </Switch>
);

export default Pages;
