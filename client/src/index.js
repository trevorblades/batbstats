import App from './components/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import DefaultClient from 'apollo-boost';
import Helmet from 'react-helmet';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import injectStyles from './styles';
import store from './store';
import theme from '@trevorblades/mui-theme';
import {ApolloProvider} from 'react-apollo';
import {BrowserRouter} from 'react-router-dom';
import {
  MuiThemeProvider,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import {Provider} from 'react-redux';
import {create} from 'jss';

const client = new DefaultClient({
  uri: 'http://localhost:4000'
});

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// we define a custom insertion point that JSS will look for injecting the styles in the DOM
jss.options.insertionPoint = 'jss-insertion-point';

injectStyles();

ReactGA.initialize('UA-34658521-2');
ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <BrowserRouter>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Helmet defaultTitle={TITLE} titleTemplate={`%s · ${TITLE}`} />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <App />
            </MuiPickersUtilsProvider>
          </MuiThemeProvider>
        </JssProvider>
      </BrowserRouter>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);
