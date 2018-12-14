import App from './components/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import Helmet from 'react-helmet';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import injectStyles from './styles';
import store from 'store';
import theme from '@trevorblades/mui-theme';
import {ApolloClient} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import {BrowserRouter} from 'react-router-dom';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {
  MuiThemeProvider,
  createGenerateClassName,
  jssPreset
} from '@material-ui/core/styles';
import {TOKEN_KEY} from './constants';
import {create} from 'jss';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';

const httpLink = createHttpLink({
  uri: `${API_URL}/graphql`
});

const authLink = setContext((_, {headers}) => {
  const token = store.get(TOKEN_KEY);
  if (!token) {
    return {headers};
  }

  return {
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const generateClassName = createGenerateClassName();
const jss = create(jssPreset());
// we define a custom insertion point that JSS will look for injecting the styles in the DOM
jss.options.insertionPoint = 'jss-insertion-point';

injectStyles();

ReactGA.initialize('UA-34658521-2');
ReactDOM.render(
  <ApolloProvider client={client}>
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
  </ApolloProvider>,
  document.getElementById('root')
);
