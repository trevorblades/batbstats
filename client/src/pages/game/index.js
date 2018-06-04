import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import NotFound from '../not-found';
import theme from '../../theme';
import {load as loadGame} from '../../actions/game';
import Header from './header';
import Timeline from './timeline';

const Content = styled.div({
  flexGrow: 1,
  padding: theme.spacing.unit * 3,
  backgroundColor: theme.palette.grey[50]
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

    return (
      <Fragment>
        <Header />
        <Content>
          <Timeline />
        </Content>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  game: state.game.properties,
  loading: state.game.loading
});

export default connect(mapStateToProps)(Game);
