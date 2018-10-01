import CenteredCircularProgress from '../../components/centered-circular-progress';
import EventBracket from './event-bracket';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import StyledDialogContent from '../../components/styled-dialog-content';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import {getBye, getLetters} from '../../util/game';

const query = gql`
  query Event($id: ID) {
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

      const uniqueTricks = {};
      const tricks = data.event.games.flatMap(game =>
        game.attempts.map(attempt => {
          uniqueTricks[attempt.trick.id] = true;
          return attempt.trick;
        })
      );

      const games = data.event.games.map(game => ({
        ...game,
        bye: getBye(game.replacements),
        letters: getLetters(game.attempts)
      }));

      return (
        <Fragment>
          <Helmet>
            <title>{data.event.name}</title>
          </Helmet>
          <Header>
            <Typography variant="display1">{data.event.name}</Typography>
          </Header>
          <StyledDialogContent>
            <Typography>Total tricks: {tricks.length}</Typography>
            <Typography>
              Unique tricks: {Object.keys(uniqueTricks).length}
            </Typography>
          </StyledDialogContent>
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
