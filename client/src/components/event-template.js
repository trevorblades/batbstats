import Layout from './layout';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {graphql} from 'gatsby';

export default function EventTemplate(props) {
  const {name} = props.data.batbstats.event;
  return (
    <Layout>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      {name}
    </Layout>
  );
}

EventTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query EventQuery($id: ID!) {
    batbstats {
      event(id: $id) {
        name
      }
    }
  }
`;
