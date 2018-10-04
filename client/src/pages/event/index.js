import CenteredCircularProgress from '../../components/centered-circular-progress';
import EventBracket from './event-bracket';
import EventCharts from './event-charts';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import flatMap from 'lodash/flatMap';
import gql from 'graphql-tag';
import keyBy from 'lodash/keyBy';
import {Query} from 'react-apollo';
import {getBye, getLetters} from '../../util/game';

const query = gql`
  query Event($id: ID!) {
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

      const games = data.event.games.map(game => ({
        ...game,
        bye: getBye(game.replacements),
        letters: getLetters(game.attempts)
      }));

      const attempts = flatMap(games, game => {
        const skaters = keyBy(game.skaters, 'id');
        return game.attempts.map(attempt => ({
          ...attempt,
          round: game.round,
          skater: skaters[attempt.skater_id]
        }));
      });

      return (
        <Fragment>
          <Helmet>
            <title>{data.event.name}</title>
          </Helmet>
          <Header>
            <Typography variant="display1">{data.event.name}</Typography>
          </Header>
          <EventCharts attempts={attempts} />
          <EventBracket games={games} />
        </Fragment>
      );
    }}
  </Query>
);

Event.propTypes = {
  match: PropTypes.object.isRequired
};

export default Event;
