import fetch from 'isomorphic-fetch';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  concat
} from '@apollo/client';
import {userFromToken} from '../utils';

const httpLink = new HttpLink({
  uri: process.env.GATSBY_API_URL,
  fetch
});

const authMiddleware = new ApolloLink((operation, forward) => {
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
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
  resolvers: {
    Query: {
      user() {
        const token = localStorage.getItem('token');
        return userFromToken(token);
      }
    }
  }
});

export default client;
