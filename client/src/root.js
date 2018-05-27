import CssBaseline from '@material-ui/core/CssBaseline';
import React, {Fragment} from 'react';
import {MuiThemeProvider} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import App from './components/app';
import store from './store';
import theme from './theme';

const Root = () => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Fragment>
        <CssBaseline />
        <App />
      </Fragment>
    </MuiThemeProvider>
  </Provider>
);

export default Root;
