import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import groupBy from 'lodash/groupBy';
import intersection from 'lodash/intersection';
import map from 'lodash/map';
import reject from 'lodash/reject';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import values from 'lodash/values';
import {Link} from 'react-router-dom';
import {getEmojiFlag} from 'countries-list';

const BracketContainer = styled.div({
  display: 'flex',
  flexShrink: 0,
  overflowX: 'auto',
  userSelect: 'none'
});

const StyledDialogContent = styled(DialogContent)({
  overflowY: 'visible'
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
class EventContent extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
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
    this.bracketContainer.scrollLeft -= event.movementX;
  };

  onMouseUp = () => {
    this.setState({dragging: false});
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  };

  renderBracket = game => {
    const replacements = game.replacements.reduce(
      (map, replacement) => ({
        ...map,
        [replacement.out_id]: replacement.in_id
      }),
      {}
    );

    return (
      <Games key={game.id}>
        <Game
          component={Link}
          to={`/games/${game.id}`}
          onDragStart={preventDefault}
        >
          {game.skaters.map((skater, index) => {
            const replaced = replacements[skater.id] === null;
            const loss = game.letters[skater.id] === 5 || replaced;
            return (
              <Fragment key={skater.id}>
                <Skater
                  noWrap
                  title={skater.full_name}
                  color={loss ? 'textSecondary' : 'default'}
                >
                  {replaced ? (
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
  };

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
        <BracketContainer
          onMouseDown={this.onMouseDown}
          style={{cursor: this.state.dragging ? 'grabbing' : 'grab'}}
          innerRef={node => {
            this.bracketContainer = node;
          }}
        >
          <div />
          {/* the empty div is to force the following DialogContent to behave as if it's :not(:first-child) */}
          <StyledDialogContent>{this.renderBracket(game)}</StyledDialogContent>
        </BracketContainer>
      </Fragment>
    );
  }
}

export default EventContent;
