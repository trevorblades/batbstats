import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getAttempts} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

const Column = styled.div({
  width: '50%',
  ':last-child': {
    textAlign: 'right'
  }
});

class Attempts extends Component {
  static propTypes = {
    attempts: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
  };

  render() {
    return (
      <Container>
        {this.props.game.skaters.map(skater => (
          <Column key={skater.id}>
            {this.props.attempts[skater.id].map(attempt => (
              <div key={attempt.id}>{attempt.trick.name}</div>
            ))}
          </Column>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  attempts: getAttempts(state),
  game: state.game.properties
});

export default connect(mapStateToProps)(Attempts);
