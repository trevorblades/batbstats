import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {
  MuiThemeProvider,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import {create} from 'jss';
import App from './components/app';
import store from './store';
import theme from './theme';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// We define a custom insertion point that JSS will look for injecting the styles in the DOM
jss.options.insertionPoint = 'jss-insertion-point';

const Root = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <App />
        </BrowserRouter>
      </Provider>
    </MuiThemeProvider>
  </JssProvider>
);

export default Root;
