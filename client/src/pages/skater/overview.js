import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import pluralize from 'pluralize';
import round from 'lodash/round';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import theme from '../../theme';
import {
  getAttempts,
  getFlipPercent,
  getOffensivePercent,
  getSuccessRate,
  getRedos
} from '../../selectors/skater';

const Container = styled.div({
  padding: theme.spacing.unit * 3
});

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
        <Tabs centered value={0}>
          <Tab label="Totals" />
          <Tab label="Offense" />
          <Tab label="Defense" />
        </Tabs>
        <Divider />
        <Container>
          <Typography>
            {pluralize('game', this.props.games.length, true)} played
          </Typography>
          <Typography>
            {pluralize('total trick', this.props.attempts.length, true)}{' '}
            attempted
          </Typography>
          <Typography>
            {round(this.props.offensivePercent * 100, 2)} % offensive
          </Typography>
          <Typography>
            {round(this.props.successRate * 100, 2)} % success rate
          </Typography>
          <Typography>{pluralize('redo', this.props.redos, true)}</Typography>
          <Typography>{this.props.flipPercent}</Typography>
        </Container>
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
