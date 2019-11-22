const dotenv = require('dotenv');
const {webFontsConfig} = require('@trevorblades/mui-theme');

dotenv.config();

module.exports = {
  siteMetadata: {
    title: 'BATB Stats'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-svgr',
    'gatsby-theme-apollo',
    {
      resolve: 'gatsby-theme-material-ui',
      options: {webFontsConfig}
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-34658521-2'
      }
    },
    {
      resolve: 'gatsby-plugin-emoji-favicon',
      options: {
        emoji: '🛹'
      }
    },
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'BATBStats',
        fieldName: 'batbstats',
        url: process.env.GATSBY_API_URL
      }
    }
  ]
};
