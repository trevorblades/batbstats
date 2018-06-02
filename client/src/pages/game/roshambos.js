import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
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

class Roshambos extends Component {
  static propTypes = {
    roshamboRounds: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
  };

  render() {
    return (
      <Container>
        {this.props.game.skaters.map(skater => (
          <Column key={skater.id}>
            {this.props.roshamboRounds.map((roshambos, index) => (
              <div key={index.toString()}>
                {roshambos.map(roshambo => (
                  <div key={roshambo.id}>{roshambo.move}</div>
                ))}
              </div>
            ))}
          </Column>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  roshamboRounds: getRoshamboRounds(state),
  game: state.game.properties
});

export default connect(mapStateToProps)(Roshambos);
