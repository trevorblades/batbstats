import Frisbee from 'frisbee';

export default new Frisbee({
  baseURI: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
