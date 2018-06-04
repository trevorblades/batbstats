import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled, {css} from 'react-emotion';
import {connect} from 'react-redux';
import RockIcon from '../../assets/icons/rock.svg';
import PaperIcon from '../../assets/icons/paper.svg';
import ScissorsIcon from '../../assets/icons/scissors.svg';
import theme from '../../theme';
import {
  ROSHAMBO_MOVE_ROCK,
  ROSHAMBO_MOVE_PAPER,
  ROSHAMBO_MOVE_SCISSORS
} from '../../../../api/common';
import {getRoshamboRounds, getRoshamboWinner} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

const iconClassName = css({
  display: 'block',
  height: 40,
  ':last-child': {
    marginLeft: theme.spacing.unit,
    transform: 'scaleX(-1)'
  }
});

const icons = {
  [ROSHAMBO_MOVE_ROCK]: RockIcon,
  [ROSHAMBO_MOVE_PAPER]: PaperIcon,
  [ROSHAMBO_MOVE_SCISSORS]: ScissorsIcon
};

class Roshambos extends Component {
  static propTypes = {
    rounds: PropTypes.array.isRequired,
    winner: PropTypes.object.isRequired
  };

  render() {
    return this.props.rounds.map((round, index, array) => (
      <Container key={index.toString()}>
        {round.map(roshambo => {
          const Icon = icons[roshambo.move];
          const didLose =
            index === array.length - 1 &&
            roshambo.skater_id !== this.props.winner.id;
          return (
            <Icon
              key={roshambo.id}
              className={iconClassName}
              fill={didLose ? theme.palette.grey[100] : null}
            />
          );
        })}
      </Container>
    ));
  }
}

const mapStateToProps = state => ({
  rounds: getRoshamboRounds(state),
  winner: getRoshamboWinner(state)
});

export default connect(mapStateToProps)(Roshambos);
