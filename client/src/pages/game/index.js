import CircularProgress from '@material-ui/core/CircularProgress';
import GameContent from './game-content';
import GamesLoader from '../../components/games-loader';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import find from 'lodash/find';
import styled from 'react-emotion';

const StyledCircularProgress = styled(CircularProgress)({
  margin: 'auto'
});

const Game = props => (
  <GamesLoader hideSnackbar>
    {(games, loading) => {
      const id = parseInt(props.match.params.id);
      const game = find(games, ['id', id]);
      if (!game) {
        return loading ? <StyledCircularProgress /> : <NotFound />;
      }
      return <GameContent game={game} />;
    }}
  </GamesLoader>
);

Game.propTypes = {
  match: PropTypes.object.isRequired
};

export default Game;
