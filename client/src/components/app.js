import React, {Fragment} from 'react';
import {hot} from 'react-hot-loader';
import Header from './header';

const App = () => (
  <Fragment>
    <Header />
    <div>hello</div>
  </Fragment>
);

export default hot(module)(App);
