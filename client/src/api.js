import Frisbee from 'frisbee';
import {API_URL} from './config';

export default new Frisbee({
  baseURI: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
