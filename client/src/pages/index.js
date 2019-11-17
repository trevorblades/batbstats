import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {ReactComponent as Logo} from 'twemoji/2/svg/1f6f9.svg';
import {LogoTitleProps} from '@trevorblades/mui-theme';
import {graphql} from 'gatsby';

export default function Index(props) {
  const {title} = props.data.site.siteMetadata;
  return (
    <Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box
        height={64}
        px={3}
        display="flex"
        alignItems="center"
        bgcolor="white"
        position="sticky"
        top={0}
      >
        <Box {...LogoTitleProps.root}>
          <Box {...LogoTitleProps.logo} component={Logo} />
          <Box {...LogoTitleProps.title}>{title}</Box>
        </Box>
      </Box>
    </Fragment>
  );
}

Index.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
