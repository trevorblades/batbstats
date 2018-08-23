import CircularProgress from '@material-ui/core/CircularProgress';
import GameContent from './game-content';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React from 'react';
import find from 'lodash/find';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getGames} from '../../selectors';

const StyledCircularProgress = styled(CircularProgress)({
  margin: 'auto'
});

const Game = props => {
  const game = find(props.games, ['id', parseInt(props.match.params.id)]);
  if (!game) {
    return props.loading ? <StyledCircularProgress /> : <NotFound />;
  }
  return <GameContent game={game} />;
};

Game.propTypes = {
  games: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  games: getGames(state),
  loading: state.games.loading
});

export default connect(mapStateToProps)(Game);
