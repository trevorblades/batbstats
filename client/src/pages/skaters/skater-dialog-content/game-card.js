import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import filter from 'lodash/filter';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/fp/keyBy';
import map from 'lodash/map';
import mapProps from 'recompose/mapProps';
import mapValues from 'lodash/mapValues';
import nest from 'recompose/nest';
import sortBy from 'lodash/sortBy';
import styled from 'react-emotion';
import toPairs from 'lodash/toPairs';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {getRoshamboEmoji, getInitialLetters} from '../../../util/game';
import {size} from 'polished';
import {ROSHAMBO_COUNTERS} from '../../../../../api/common';

const Video = styled.div({
  paddingTop: `${9 / 16 * 100}%`,
  position: 'relative'
});

const StyledIframe = styled.iframe(size('100%'), {
  position: 'absolute',
  top: 0,
  left: 0
});

const DenseTable = withProps({padding: 'dense'})(Table);

const StyledTableCell = mapProps(props => ({
  ...props,
  numeric: !props.index
}))(
  styled(TableCell)({
    width: '50%'
  })
);

const Commentary = nest(
  TableRow,
  withProps({colSpan: 2})(TableCell),
  withProps({align: 'center'})(DialogContentText)
);

function getAttemptText(attempt) {
  const {successful} = attempt;
  if (attempt.offense) {
    let {name} = attempt.trick;
    if (attempt.redos) {
      name += ' 🔄';
      if (attempt.redos > 1) {
        name += attempt.redos;
      }
    }

    return successful ? name : <s>{name}</s>;
  }

  return successful ? '✅' : '❌';
}

const LETTERS = 'SKATE'.split('');

class GameCard extends Component {
  static propTypes = {
    children: PropTypes.node,
    game: PropTypes.object.isRequired
  };

  get rounds() {
    const rounds = [];
    const {attempts} = this.props.game;
    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      const round = [attempt, null];
      if (attempt.successful) {
        i++;
        round[1] = attempts[i];
      }

      rounds.push(round);
    }

    const skaterIds = map(this.props.game.skaters, 'id');
    return rounds.map(round =>
      sortBy(
        round,
        attempt => (attempt ? skaterIds.indexOf(attempt.skater_id) : 0)
      )
    );
  }

  renderRoshambos(skaters) {
    const roshambos = mapValues(
      groupBy(this.props.game.roshambos, 'round'),
      keyBy('skater_id')
    );

    const keys = Object.keys(roshambos);
    const lastRound = roshambos[keys[keys.length - 1]];
    const pairs = toPairs(mapValues(lastRound, 'move')).sort(
      (a, b) => (ROSHAMBO_COUNTERS[a[1]] === b[1] ? 1 : -1)
    );

    const winner = skaters[Number(pairs[0][0])];
    return (
      <Fragment>
        {keys.map(key => (
          <TableRow key={key}>
            {this.props.game.skaters.map((skater, index) => {
              const {move} = roshambos[key][skater.id];
              return (
                <StyledTableCell key={skater.id} index={index}>
                  <span title={move}>{getRoshamboEmoji(move)}</span>
                </StyledTableCell>
              );
            })}
          </TableRow>
        ))}
        <Commentary>
          {upperFirst(pairs[0][1])} beats {pairs[1][1]}, {winner.first_name}{' '}
          goes first
        </Commentary>
      </Fragment>
    );
  }

  renderRounds(skaters) {
    const letters = getInitialLetters(this.props.game.skaters);
    return this.rounds.map(round => {
      let letterAgainst;
      const attempts = filter(round);
      return (
        <Fragment key={map(attempts, 'id')}>
          <TableRow>
            {round.map((attempt, index) => {
              if (!attempt) {
                return <StyledTableCell key="miss" index={index} />;
              }

              if (!attempt.offense && !attempt.successful) {
                const {skater_id} = attempt;
                letters[skater_id]++;
                letterAgainst = skaters[skater_id];
              }

              return (
                <StyledTableCell key={attempt.id} index={index}>
                  {getAttemptText(attempt)}
                </StyledTableCell>
              );
            })}
          </TableRow>
          {letterAgainst && (
            <Commentary>
              {letterAgainst.first_name} is at{' '}
              {LETTERS.slice(0, letters[letterAgainst.id]).join('.')}.
            </Commentary>
          )}
          {attempts.length === 1 &&
            this.renderMissCommentary(attempts[0].skater_id, skaters)}
        </Fragment>
      );
    });
  }

  renderMissCommentary(id, skaters) {
    const skaterIds = Object.keys(skaters);
    const opponents = {
      [skaterIds[0]]: skaters[skaterIds[1]],
      [skaterIds[1]]: skaters[skaterIds[0]]
    };

    return (
      <Commentary>
        {skaters[id].first_name} misses, {opponents[id].first_name}&apos;s turn
      </Commentary>
    );
  }

  render() {
    const skaters = keyBy('id')(this.props.game.skaters);
    return (
      <Fragment>
        <DialogTitle disableTypography>
          {this.props.children}
          <Typography variant="title">
            {map(this.props.game.skaters, 'full_name').join(' vs. ')}
          </Typography>
          <Typography variant="subheading">
            {this.props.game.event.short_name} {this.props.game.round_name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {this.props.game.video_id && (
            <Video>
              <StyledIframe
                allowFullScreen
                src={`https://www.youtube.com/embed/${
                  this.props.game.video_id
                }?rel=0&showinfo=0`}
                frameBorder={0}
                allow="autoplay; encrypted-media"
              />
            </Video>
          )}
          <DenseTable>
            <TableHead>
              <TableRow>
                {this.props.game.skaters.map((skater, index) => (
                  <StyledTableCell key={skater.id} index={index}>
                    {skater.full_name}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.renderRoshambos(skaters)}
              {this.renderRounds(skaters)}
            </TableBody>
          </DenseTable>
        </DialogContent>
      </Fragment>
    );
  }
}

export default GameCard;
