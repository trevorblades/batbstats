import CircularProgress from '@material-ui/core/CircularProgress';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import map from 'lodash/map';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import NotFound from '../not-found';
import theme from '../../theme';
import {getFullName} from '../../util/skater';
import {load as loadGame} from '../../actions/game';

const Container = styled.div({
  padding: theme.spacing.unit * 3
});

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

    const title = map(this.props.game.skaters, getFullName).join(' vs. ');
    return (
      <Container>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Typography variant="title">{this.props.game.event.name}</Typography>
        <Typography variant="subheading">{title}</Typography>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  loading: state.game.loading
});

export default connect(mapStateToProps)(Game);
