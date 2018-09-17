import DialogContent from '@material-ui/core/DialogContent';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import reject from 'lodash/reject';
import styled from 'react-emotion';
import values from 'lodash/values';

const StyledDialogContent = styled(DialogContent)({
  overflowY: 'visible'
});

function addGameChildren(game, rounds, index) {
  const children = rounds[index];
  if (!children) {
    return game;
  }

  return {
    ...game,
    children: children
      .filter(child => {
        const skaters = map(child.skaters, 'id');
        return game.skaters.some(skater => skaters.includes(skater.id));
      })
      .map(child => addGameChildren(child, rounds, index + 1))
  };
}

class EventContent extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  };

  renderGame = game => (
    <Fragment key={game.id}>
      <div>
        {game.skaters.map(skater => (
          <div key={skater.id}>{skater.full_name}</div>
        ))}
      </div>
      {game.children && game.children.map(this.renderGame)}
    </Fragment>
  );

  render() {
    const rounds = values(
      groupBy(reject(this.props.event.games, ['round', 5]), 'round')
    ).reverse();
    const game = addGameChildren(rounds[0][0], rounds, 1);
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.event.name}</title>
        </Helmet>
        <Header>
          <Typography variant="headline">{this.props.event.name}</Typography>
        </Header>
        <StyledDialogContent>{this.renderGame(game)}</StyledDialogContent>
      </Fragment>
    );
  }
}

export default EventContent;
