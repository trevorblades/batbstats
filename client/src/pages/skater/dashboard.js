import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import round from 'lodash/round';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import theme from '../../theme';
import {getAttempts, getSuccessRate} from '../../selectors/skater';

const Container = styled.div({
  padding: theme.spacing.unit * 3
});

class Dashboard extends Component {
  static propTypes = {
    attempts: PropTypes.array.isRequired,
    successRate: PropTypes.number.isRequired
  };

  render() {
    return (
      <Container>
        <Typography>{this.props.attempts.length} trick attempts</Typography>
        <Typography>
          {round(this.props.successRate * 100, 2)} % success rate
        </Typography>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  attempts: getAttempts(state),
  successRate: getSuccessRate(state)
});

export default connect(mapStateToProps)(Dashboard);
