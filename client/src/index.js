import './styles';
import App from './components/app';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import store from './store';
import theme from '@trevorblades/mui-theme';
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  </JssProvider>,
  document.getElementById('root')
);
