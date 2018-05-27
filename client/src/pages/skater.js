import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {load as loadSkater} from '../actions/skater';
import NotFound from './not-found';

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

  shouldComponentUpdate(nextProps) {
    console.log(nextProps.match.params.id, this.props.match.params.id);
    return true;
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps.match.params.id, this.props.match.params.id);
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
      <div>
        <Typography variant="subheading">
          {this.props.skater.first_name}
        </Typography>
        <Typography variant="headline">
          {this.props.skater.last_name}
        </Typography>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skater.loading,
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Skater);
