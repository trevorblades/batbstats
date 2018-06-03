import PropTypes from 'prop-types';
import React, {Component} from 'react';
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
import {getRoshamboRounds} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

const Column = styled.div({
  width: '50%',
  ':first-child': {
    textAlign: 'right'
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
    roshamboRounds: PropTypes.array.isRequired
  };

  render() {
    return this.props.roshamboRounds.map((roshambos, index) => (
      <Container key={index.toString()}>
        {roshambos.map(roshambo => {
          const Icon = icons[roshambo.move];
          return (
            <Column key={roshambo.id}>
              <Icon
                className={iconClassName}
                fill={roshambo.loser && theme.palette.grey[100]}
              />
            </Column>
          );
        })}
      </Container>
    ));
  }
}

const mapStateToProps = state => ({
  roshamboRounds: getRoshamboRounds(state)
});

export default connect(mapStateToProps)(Roshambos);
