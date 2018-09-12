import CenteredCircularProgress from '../../components/centered-circular-progress';
import GameContent from './game-content';
import GamesLoader from '../../components/games-loader';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import find from 'lodash/find';

const Game = props => (
  <GamesLoader hideSnackbar>
    {(games, loading) => {
      const game = find(games, ['id', parseInt(props.match.params.id)]);
      if (!game) {
        return loading ? <CenteredCircularProgress /> : <NotFound />;
      }
      return <GameContent game={game} />;
    }}
  </GamesLoader>
);

Game.propTypes = {
  match: PropTypes.object.isRequired
};

export default Game;
