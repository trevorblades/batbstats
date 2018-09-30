import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import StyledDialogContent from '../../components/styled-dialog-content';
import Typography from '@material-ui/core/Typography';
import groupBy from 'lodash/groupBy';
import intersection from 'lodash/intersection';
import map from 'lodash/map';
import reject from 'lodash/reject';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import {Link} from 'react-router-dom';
import {getEmojiFlag} from 'countries-list';

const Container = styled.div({
  display: 'flex',
  flexShrink: 0,
  overflowX: 'auto',
  userSelect: 'none'
});

const Games = styled.div({
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  justifyContent: 'flex-end'
});

const Game = styled(Paper)({
  flexShrink: 0,
  width: 200,
  margin: `${theme.spacing.unit * 2}px 0`,
  textDecoration: 'none'
});

const Skater = styled(Typography)({
  padding: `${theme.spacing.unit / 2}px ${theme.spacing.unit}px`
});

const Connector = styled.div({
  display: 'flex',
  alignSelf: 'stretch',
  alignItems: 'center'
});

const bracketWidth = theme.spacing.unit * 2;
const bracketColor = theme.palette.grey[300];
const Bracket = styled.div({
  flexGrow: 1,
  width: bracketWidth,
  height: '50%',
  border: `solid 1px ${bracketColor}`,
  borderLeft: 'none'
});

const Line = styled.div({
  width: bracketWidth,
  height: 1,
  backgroundColor: bracketColor
});

function addGameChildren(game, rounds, index) {
  const children = rounds[index];
  if (!children) {
    return game;
  }

  const replacements = map(game.replacements, 'out_id');
  const skaters = map(game.skaters, 'id').concat(replacements);
  return {
    ...game,
    children: children
      .filter(child => intersection(skaters, map(child.skaters, 'id')).length)
      .map(child =>
        addGameChildren(
          replacements.length
            ? {
                ...child,
                skaters: child.skaters.map(skater => ({
                  ...skater,
                  replaced: replacements.includes(skater.id)
                }))
              }
            : child,
          rounds,
          index + 1
        )
      )
  };
}

const preventDefault = event => event.preventDefault();
class EventBracket extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired
  };

  state = {
    dragging: false
  };

  onMouseDown = () => {
    this.setState({dragging: true});
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseMove = event => {
    this.container.scrollLeft -= event.movementX;
  };

  onMouseUp = () => {
    this.setState({dragging: false});
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  renderBracket = game => (
    <Games key={game.id}>
      <Game
        component={game.bye ? 'div' : Link}
        to={game.bye ? null : `/games/${game.id}`}
        onDragStart={preventDefault}
      >
        {game.skaters.map((skater, index) => {
          const bye = game.bye === skater.id;
          return (
            <Fragment key={skater.id}>
              <Skater
                noWrap
                title={skater.full_name}
                color={
                  game.letters[skater.id] === 5 || bye
                    ? 'textSecondary'
                    : 'default'
                }
              >
                {bye ? (
                  'Bye'
                ) : (
                  <Fragment>
                    {skater.country && `${getEmojiFlag(skater.country)} `}
                    <span
                      style={{
                        textDecoration: skater.replaced
                          ? 'line-through'
                          : 'none'
                      }}
                    >
                      {skater.full_name}
                    </span>
                  </Fragment>
                )}
              </Skater>
              {!index && <Divider />}
            </Fragment>
          );
        })}
      </Game>
      {game.round > 1 && (
        <Connector>
          <Bracket />
          <Line />
        </Connector>
      )}
      <div>{game.children && game.children.map(this.renderBracket)}</div>
    </Games>
  );

  render() {
    const games = reject(this.props.games, ['round', 5]);
    const groups = groupBy(games, 'round');
    const rounds = Object.values(groups).reverse();
    const game = addGameChildren(rounds[0][0], rounds, 1);

    console.log(rounds);

    return (
      <Container
        onMouseDown={this.onMouseDown}
        style={{cursor: this.state.dragging ? 'grabbing' : 'grab'}}
        innerRef={node => {
          this.container = node;
        }}
      >
        <div />
        {/* the empty div is to force the following DialogContent to behave as if it's :not(:first-child) */}
        <StyledDialogContent>{this.renderBracket(game)}</StyledDialogContent>
      </Container>
    );
  }
}

export default EventBracket;
