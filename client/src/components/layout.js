import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {useTitle} from '../utils';

export default function Layout(props) {
  const title = useTitle();
  return (
    <>
      <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`} />
      {props.children}
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};
