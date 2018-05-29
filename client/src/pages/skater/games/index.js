import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getGames} from '../../../selectors/skater';
import GameCard from './game-card';

class Games extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired
  };

  render() {
    return (
      <Grid container spacing={24}>
        {this.props.games.map(game => <GameCard key={game.id} game={game} />)}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  games: getGames(state)
});

export default connect(mapStateToProps)(Games);
