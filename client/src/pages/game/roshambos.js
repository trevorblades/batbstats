import PropTypes from 'prop-types';
import React, {Component} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getRoshambos} from '../../selectors/game';

const Container = styled.div({
  display: 'flex'
});

class Roshambos extends Component {
  static propTypes = {
    roshambos: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired
  };

  render() {
    return (
      <Container>
        {this.props.game.skaters.map(skater => (
          <div key={skater.id}>
            {this.props.roshambos[skater.id].map(roshambo => (
              <div key={roshambo.id}>{roshambo.move}</div>
            ))}
          </div>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  roshambos: getRoshambos(state),
  game: state.game.properties
});

export default connect(mapStateToProps)(Roshambos);
