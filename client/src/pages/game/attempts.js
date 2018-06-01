import PropTypes from 'prop-types';
import React, {Component} from 'react';
import map from 'lodash/map';
import styled from 'react-emotion';
import {connect} from 'react-redux';

const Attempt = styled.div(props => ({
  width: '50%',
  marginLeft: props.right ? '50%' : 0,
  textAlign: props.right ? 'left' : 'right'
}));

class Attempts extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired
  };

  render() {
    const skaterIds = map(this.props.game.skaters, 'id');
    return (
      <div>
        {this.props.game.attempts.map(attempt => (
          <Attempt
            key={attempt.id}
            right={skaterIds.indexOf(attempt.skater_id)}
          >
            {attempt.trick.name}
          </Attempt>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties
});

export default connect(mapStateToProps)(Attempts);
