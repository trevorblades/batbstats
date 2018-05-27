import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import upperFirst from 'lodash/upperFirst';
import {connect} from 'react-redux';
import {getAge, getAttempts} from '../../selectors/skater';

class Bio extends Component {
  static propTypes = {
    age: PropTypes.number.isRequired,
    attempts: PropTypes.array.isRequired,
    skater: PropTypes.object.isRequired
  };

  render() {
    return (
      <Fragment>
        {this.props.skater.last_name && (
          <Typography variant="subheading">
            {this.props.skater.first_name}
          </Typography>
        )}
        <Typography variant="title">
          {this.props.skater.last_name || this.props.skater.first_name}
        </Typography>
        {this.props.skater.stance && (
          <Typography>{upperFirst(this.props.skater.stance)}</Typography>
        )}
        {this.props.skater.hometown && (
          <Typography>{this.props.skater.hometown}</Typography>
        )}
        {this.props.age && <Typography>{this.props.age} years old</Typography>}
        <Typography>{this.props.attempts.length} trick attempts</Typography>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  age: getAge(state),
  attempts: getAttempts(state)
});

export default connect(mapStateToProps)(Bio);
