import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getAttempts} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

class Attempts extends Component {
  static propTypes = {
    attempts: PropTypes.array.isRequired,
    game: PropTypes.object.isRequired
  };

  render() {
    return (
      <Container>
        {this.props.game.skaters.map(skater => (
          <div key={skater.id}>
            {this.props.attempts[skater.id].map(attempt => (
              <div key={attempt.id}>{attempt.trick.name}</div>
            ))}
          </div>
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
