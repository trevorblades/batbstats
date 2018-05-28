import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {load as loadSkater} from '../../actions/skater';
import NotFound from '../not-found';
import Header from './header';
import Dashboard from './dashboard';

class Skater extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    skater: PropTypes.object
  };

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.load();
    }
  }

  load = () => this.props.dispatch(loadSkater(this.props.match.params.id));

  render() {
    if (!this.props.skater) {
      if (this.props.loading) {
        return <CircularProgress />;
      }
      return <NotFound />;
    }

    return (
      <Fragment>
        <Header />
        <Divider />
        <Dashboard />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skater.loading,
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Skater);
