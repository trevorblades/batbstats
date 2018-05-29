import CircularProgress from '@material-ui/core/CircularProgress';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import {connect} from 'react-redux';
import NotFound from '../not-found';
import {getFullName} from '../../util/skater';
import {load as loadGame} from '../../actions/game';

class Game extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    game: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadGame(this.props.match.params.id));
  }

  render() {
    if (!this.props.game) {
      if (this.props.loading) {
        return <CircularProgress />;
      }
      return <NotFound />;
    }

    return (
      <Fragment>
        <Helmet>
          <title>
            {map(this.props.game.skaters, getFullName).join(' vs. ')}
          </title>
        </Helmet>
        <Typography variant="title">{this.props.game.event.name}</Typography>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  loading: state.game.loading
});

export default connect(mapStateToProps)(Game);
