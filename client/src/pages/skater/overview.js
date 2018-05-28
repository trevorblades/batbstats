import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import pluralize from 'pluralize';
import round from 'lodash/round';
import {connect} from 'react-redux';
import {
  getAttempts,
  getFlipPercent,
  getOffensivePercent,
  getSuccessRate,
  getRedos
} from '../../selectors/skater';

class Overview extends Component {
  static propTypes = {
    attempts: PropTypes.array.isRequired,
    flipPercent: PropTypes.number.isRequired,
    games: PropTypes.array.isRequired,
    offensivePercent: PropTypes.number.isRequired,
    redos: PropTypes.number.isRequired,
    successRate: PropTypes.number.isRequired
  };

  render() {
    return (
      <Fragment>
        <Typography>
          {pluralize('game', this.props.games.length, true)} played
        </Typography>
        <Typography>
          {pluralize('total trick', this.props.attempts.length, true)} attempted
        </Typography>
        <Typography>
          {round(this.props.offensivePercent * 100, 2)} % offensive
        </Typography>
        <Typography>
          {round(this.props.successRate * 100, 2)} % success rate
        </Typography>
        <Typography>{pluralize('redo', this.props.redos, true)}</Typography>
        <Typography>{this.props.flipPercent}</Typography>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  attempts: getAttempts(state),
  flipPercent: getFlipPercent(state),
  games: state.skater.properties.games,
  offensivePercent: getOffensivePercent(state),
  redos: getRedos(state),
  successRate: getSuccessRate(state)
});

export default connect(mapStateToProps)(Overview);
