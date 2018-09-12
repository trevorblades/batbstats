import CenteredCircularProgress from '../../components/centered-circular-progress';
import EventContent from './event-content';
import GamesLoader from '../../components/games-loader';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import find from 'lodash/find';
import {getEventsFromGames} from '../../util/event';

const Game = props => (
  <GamesLoader hideSnackbar>
    {(games, loading) => {
      const events = getEventsFromGames(games);
      const event = find(events, ['id', parseInt(props.match.params.id)]);
      if (!event) {
        return loading ? <CenteredCircularProgress /> : <NotFound />;
      }
      return <EventContent event={event} />;
    }}
  </GamesLoader>
);

Game.propTypes = {
  match: PropTypes.object.isRequired
};

export default Game;
