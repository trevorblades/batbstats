import CircularProgress from '@material-ui/core/CircularProgress';
import GameContent from './game-content';
import GamesLoader from '../../components/games-loader';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import find from 'lodash/find';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getGames} from '../../selectors';

const StyledCircularProgress = styled(CircularProgress)({
  margin: 'auto'
});

class Game extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired
  };

  renderContent() {
    const id = parseInt(this.props.match.params.id);
    const game = find(this.props.games, ['id', id]);
    if (!game) {
      return this.props.loading ? <StyledCircularProgress /> : <NotFound />;
    }
    return <GameContent game={game} />;
  }

  render() {
    return <GamesLoader hideSnackbar>{this.renderContent()}</GamesLoader>;
  }
}

const mapStateToProps = state => ({
  games: getGames(state),
  loading: state.games.loading
});

export default connect(mapStateToProps)(Game);
