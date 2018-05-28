import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {connect} from 'react-redux';
import {load as loadSkaters} from '../../actions/skaters';
import SkaterListItem from './skater-list-item';

class Skaters extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadSkaters());
  }

  render() {
    if (!this.props.skaters.length === 0) {
      if (this.props.loading) {
        return <CircularProgress />;
      }
      return <Typography>No skaters found</Typography>;
    }

    return (
      <List>
        {this.props.skaters.map(skater => (
          <SkaterListItem key={skater.id} skater={skater} />
        ))}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skaters.loading,
  skaters: state.skaters.items
});

export default connect(mapStateToProps)(Skaters);
