export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.batbstats.trevorblades.com'
    : 'http://localhost:3000';
