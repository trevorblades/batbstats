require('dotenv').config();
module.exports = {
  plugins: [
    'gatsby-plugin-svgr',
    'gatsby-plugin-react-helmet',
    'gatsby-theme-apollo',
    '@chakra-ui/gatsby-plugin',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Countries',
        fieldName: 'countries',
        url: 'https://countries.trevorblades.com'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        icon: 'src/assets/logo.svg'
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
