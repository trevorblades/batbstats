import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';

class Dashboard extends Component {
  static propTypes = {
    skaters: PropTypes.array.isRequired
  };

  render() {
    return <div>{this.props.skaters.length} skaters</div>;
  }
}

const mapStateToProps = state => ({
  skaters: state.skaters.items
});

export default connect(mapStateToProps)(Dashboard);
