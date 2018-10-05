import GameContent from './game-content';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import gql from 'graphql-tag';
import {CenteredCircularProgress} from '../../components';
import {Query} from 'react-apollo';

const query = gql`
  query Game($id: ID) {
    game(id: $id) {
      id
      round
      event {
        id
        name
      }
      skaters {
        id
        first_name
        full_name
      }
      roshambos {
        id
        round
        move
        skater_id
      }
      attempts {
        id
        successful
        offense
        redos
        skater_id
        trick {
          id
          name
          flip
        }
      }
    }
  }
`;

const Game = props => (
  <Query query={query} variables={{id: props.match.params.id}}>
    {({loading, error, data}) => {
      if (loading) return <CenteredCircularProgress />;
      if (error) return <NotFound />;
      return <GameContent game={data.game} />;
    }}
  </Query>
);

Game.propTypes = {
  match: PropTypes.object.isRequired
};

export default Game;
