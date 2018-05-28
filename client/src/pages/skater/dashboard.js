import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import pluralize from 'pluralize';
import round from 'lodash/round';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import theme from '../../theme';
import {getAttempts, getSuccessRate, getRedos} from '../../selectors/skater';

const Container = styled.div({
  padding: theme.spacing.unit * 3
});

class Dashboard extends Component {
  static propTypes = {
    attempts: PropTypes.array.isRequired,
    redos: PropTypes.object.isRequired,
    skater: PropTypes.object.isRequired,
    successRate: PropTypes.number.isRequired
  };

  render() {
    return (
      <Container>
        <Typography>
          {pluralize('game', this.props.skater.games.length, true)} played
        </Typography>
        <Typography>
          {pluralize('trick', this.props.attempts.length, true)} attempted
        </Typography>
        <Typography>
          {round(this.props.successRate * 100, 2)} % success rate
        </Typography>
        <Typography>{pluralize('redo', this.props.redos, true)}</Typography>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  attempts: getAttempts(state),
  redos: getRedos(state),
  skater: state.skater.properties,
  successRate: getSuccessRate(state)
});

export default connect(mapStateToProps)(Dashboard);
