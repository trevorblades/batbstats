import fetch from 'isomorphic-fetch';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client';

const httpLink = new HttpLink({
  uri: process.env.GATSBY_API_URL,
  fetch
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');
  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
