const {webFontsConfig} = require('@trevorblades/mui-theme');

module.exports = {
  siteMetadata: {
    title: 'BATB Stats'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-svgr',
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
    }
  ]
};
