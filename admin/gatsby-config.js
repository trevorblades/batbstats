module.exports = {
  plugins: [
    'gatsby-theme-apollo',
    '@chakra-ui/gatsby-plugin',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'Countries',
        fieldName: 'countries',
        url: 'https://countries.trevorblades.com'
      }
    }
  ]
};
