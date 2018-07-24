import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {connect} from 'react-redux';

const EmptyState = styled.div({
  margin: 'auto'
});

class EmptyStateProvider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    games: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  renderEmptyState() {
    if (this.props.loading) {
      return <CircularProgress />;
    }
    return <Typography variant="subheading">No data found</Typography>;
  }

  render() {
    if (!this.props.games.length) {
      return <EmptyState>{this.renderEmptyState()}</EmptyState>;
    }
    return this.props.children;
  }
}

const mapStateToProps = state => ({
  games: state.games.data,
  loading: state.games.loading
});

export default connect(mapStateToProps)(EmptyStateProvider);
