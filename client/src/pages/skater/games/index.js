import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import GameCard from './game-card';

class Games extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired
  };

  render() {
    return (
      <Grid container spacing={24}>
        {this.props.skater.games.map(game => (
          <GameCard key={game.id} game={game} />
        ))}
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Games);
