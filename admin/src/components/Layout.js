import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';

export default function Layout({children}) {
  return (
    <>
      <Helmet defaultTitle="BATB Stats" titleTemplate="%s - BATB Stats" />
      {children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
