import './styles';
import App from './components/app';
import JssProvider from 'react-jss/lib/JssProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import store from './store';
import theme from './theme';
import {BrowserRouter} from 'react-router-dom';
import {
  MuiThemeProvider,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import {create} from 'jss';

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// we define a custom insertion point that JSS will look for injecting the styles in the DOM
jss.options.insertionPoint = 'jss-insertion-point';

ReactGA.initialize('UA-34658521-2');
ReactDOM.render(
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById('root')
);
