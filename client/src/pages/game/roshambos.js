import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import find from 'lodash/find';
import styled, {css} from 'react-emotion';
import {connect} from 'react-redux';
import {size} from 'polished';
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

const Column = styled.div({
  width: '50%',
  textAlign: 'right',
  ':last-child': {
    textAlign: 'left',
    svg: {
      transform: 'scaleX(-1)'
    }
  }
});

const iconClassName = css(size(48));

const icons = {
  [ROSHAMBO_MOVE_ROCK]: RockIcon,
  [ROSHAMBO_MOVE_PAPER]: PaperIcon,
  [ROSHAMBO_MOVE_SCISSORS]: ScissorsIcon
};

class Roshambos extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    rounds: PropTypes.array.isRequired,
    winner: PropTypes.number.isRequired
  };

  renderWinner() {}

  render() {
    const winner = find(this.props.game.skaters, ['id', this.props.winner]);
    return (
      <Fragment>
        {this.props.rounds.map((round, index, array) => (
          <Container key={index.toString()}>
            {round.map(roshambo => {
              const Icon = icons[roshambo.move];
              const didLose =
                index === array.length - 1 &&
                roshambo.skater_id !== this.props.winner;
              return (
                <Column key={roshambo.id}>
                  <Icon
                    className={iconClassName}
                    fill={didLose ? theme.palette.grey[100] : null}
                  />
                </Column>
              );
            })}
          </Container>
        ))}
        <Typography align="center" variant="button">
          {winner.first_name} goes first
        </Typography>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  rounds: getRoshamboRounds(state),
  winner: getRoshamboWinner(state)
});

export default connect(mapStateToProps)(Roshambos);
