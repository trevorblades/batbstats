import CenteredCircularProgress from '../../components/centered-circular-progress';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import SkaterContent from './skater-content';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';

const query = gql`
  query Skater($id: ID!) {
    skater(id: $id) {
      id
      full_name
      country
      birth_date
      stance
      games {
        id
        round
        event {
          name
        }
        skaters {
          id
          full_name
        }
        replacements {
          in_id
          out_id
        }
        attempts {
          successful
          offense
          skater_id
          trick {
            flip
          }
        }
      }
    }
  }
`;

const Skater = props => (
  <Query query={query} variables={{id: props.match.params.id}}>
    {({loading, error, data}) => {
      if (loading) return <CenteredCircularProgress />;
      if (error) return <NotFound />;
      return <SkaterContent skater={data.skater} />;
    }}
  </Query>
);

Skater.propTypes = {
  match: PropTypes.object.isRequired
};

export default Skater;
