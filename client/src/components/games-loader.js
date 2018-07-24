import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {load as loadGames} from '../actions/games';

const EmptyState = styled.div({
  margin: 'auto'
});

class GamesLoader extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    dispatch: PropTypes.func.isRequired,
    games: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
  };

  componentDidMount() {
    if (!this.props.loading && !this.props.games.length) {
      this.props.dispatch(loadGames());
    }
  }

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

export default connect(mapStateToProps)(GamesLoader);
