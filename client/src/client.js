import store from 'store';
import {ApolloClient} from 'apollo-client';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {TOKEN_KEY} from './constants';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';

const httpLink = createHttpLink({uri: `${API_URL}/graphql`});
const authLink = setContext((_, {headers}) => {
  const token = store.get(TOKEN_KEY);
  if (!token) {
    return {headers};
  }

  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`
    }
  };
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
