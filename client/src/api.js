import Frisbee from 'frisbee';

export default new Frisbee({
  baseURI:
    process.env.NODE_ENV === 'production'
      ? 'https://api.batbstats.trevorblades.com'
      : 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});
