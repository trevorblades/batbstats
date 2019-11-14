import EventContent from './event-content';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import gql from 'graphql-tag';
import {CenteredCircularProgress} from '../../components';
import {Query} from 'react-apollo';

const query = gql`
  query($id: ID) {
    event(id: $id) {
      id
      name
      games {
        id
        round
        skaters {
          id
          full_name
          country
          stance
        }
        replacements {
          in_id
          out_id
        }
        attempts {
          offense
          successful
          skater_id
          trick {
            id
            variation
            flip
            spin
          }
        }
      }
    }
  }
`;

const Event = props => (
  <Query query={query} variables={{id: props.match.params.id}}>
    {({loading, error, data}) => {
      if (loading) return <CenteredCircularProgress />;
      if (error) return <NotFound />;
      return <EventContent event={data.event} />;
    }}
  </Query>
);

Event.propTypes = {
  match: PropTypes.object.isRequired
};

export default Event;
