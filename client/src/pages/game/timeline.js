import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import theme from '../../theme';
import {getRoshamboWinner} from '../../selectors/game';
import Attempt from './attempt';
import Roshambos from './roshambos';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const Row = styled.div({
  display: 'flex'
});

const Column = styled.div({
  display: 'flex',
  flexGrow: 1,
  width: 0,
  padding: `${theme.spacing.unit}px 0`,
  color: theme.palette.secondary[500],
  ':first-child': {
    justifyContent: 'flex-end',
    color: theme.palette.primary[500]
  }
});

const Line = styled.div(props => ({
  width: 4,
  margin: `0 ${theme.spacing.unit * 2}px`,
  backgroundColor: theme.palette[props.primary ? 'primary' : 'secondary'][500]
}));

const Caption = withProps({
  align: 'center',
  variant: 'button'
})(
  styled(Typography)({
    margin: `${theme.spacing.unit * 3}px 0`
  })
);

class Timeline extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    roshamboWinner: PropTypes.object.isRequired
  };

  renderAttempts() {
    let setter = this.props.roshamboWinner;
    const skaterIds = map(this.props.game.skaters, 'id');
    const firstId = skaterIds[0];
    return this.props.game.attempts.map(attempt => {
      const columns = [
        <Column key="first">
          <Attempt attempt={attempt} />
        </Column>,
        <Line key="line" primary={setter.id === firstId} />,
        <Column key="last" />
      ];

      if (attempt.skater_id !== firstId) {
        columns.reverse();
      }

      let changed;
      if (attempt.offense) {
        if (!attempt.successful) {
          const currentIndex = skaterIds.indexOf(attempt.skater_id);
          setter = this.props.game.skaters[currentIndex ? 0 : 1];
          changed = true;
        }
      }

      return (
        <Fragment key={attempt.id}>
          <Row>{columns}</Row>
          {changed && <Caption>{setter.first_name}&apos;s turn to set</Caption>}
        </Fragment>
      );
    });
  }

  render() {
    return (
      <Container>
        <Roshambos />
        <Caption>{this.props.roshamboWinner.first_name} goes first</Caption>
        {this.renderAttempts()}
        <Caption>Shane wins!</Caption>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  roshamboWinner: getRoshamboWinner(state)
});

export default connect(mapStateToProps)(Timeline);
