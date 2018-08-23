import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {load as loadGames} from '../actions/games';
import {getGames} from '../selectors';

const EmptyState = styled.div({
  margin: 'auto'
});

class GamesLoader extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
      .isRequired,
    dispatch: PropTypes.func.isRequired,
    games: PropTypes.array.isRequired,
    hideSnackbar: PropTypes.bool,
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

    return (
      <Fragment>
        {React.isValidElement(this.props.children)
          ? this.props.children
          : this.props.children(this.props.games, this.props.loading)}
        {!this.props.hideSnackbar && (
          <Snackbar
            open={this.props.loading}
            message="Loading data..."
            action={<CircularProgress color="inherit" size={24} />}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          />
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  games: getGames(state),
  loading: state.games.loading
});

export default connect(mapStateToProps)(GamesLoader);
