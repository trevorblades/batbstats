import fetch from 'isomorphic-fetch';
import {ApolloClient, HttpLink, InMemoryCache} from '@apollo/client';
import {userFromToken} from '../utils';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: process.env.GATSBY_API_URL,
    fetch
  }),
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
