import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
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
import styled, {css} from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import toPairs from 'lodash/toPairs';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {ROSHAMBO_COUNTERS} from '../../../../../api/common';
import {getRoshamboEmoji, getInitialLetters} from '../../../util/game';
import {size, position} from 'polished';

const aspectRatio = 16 / 9;
const Video = styled.div({
  paddingTop: `${100 / aspectRatio}%`,
  backgroundColor: theme.palette.grey[100],
  position: 'relative'
});

const closeButtonSpacing = theme.spacing.unit * 1.5;
const CloseButtonBase = styled(Button)({
  position: 'absolute',
  top: closeButtonSpacing,
  left: closeButtonSpacing
});

const CloseButton = withProps({
  variant: 'fab',
  mini: true
})(CloseButtonBase);

const positionAbsolute = position('absolute', 0);
const StyledIframe = styled.iframe(size('100%'), positionAbsolute);

const width = 360;
const spacing = theme.spacing.unit * 3;
const fixed = css({
  width,
  height: width / aspectRatio,
  boxShadow: theme.shadows[3],
  position: 'fixed',
  bottom: spacing,
  left: spacing,
  zIndex: theme.zIndex.modal
});

const VideoInner = styled.div(
  props => (props.fixed ? fixed : positionAbsolute),
  {
    [`:not(:hover) ${CloseButtonBase}`]: {
      display: 'none'
    }
  }
);

const DenseTable = withProps({padding: 'dense'})(Table);
const StyledTableCell = mapProps(props => ({
  ...props,
  numeric: !props.index
}))(styled(TableCell)({width: '50%'}));

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

  state = {
    videoInView: false,
    fixedVideo: false
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

  onScroll = event => {
    const style = getComputedStyle(event.target);
    const padding = parseInt(style.getPropertyValue('padding-left'));
    const videoWidth = event.target.offsetWidth - padding * 2;
    const videoHeight = videoWidth / aspectRatio;
    const threshold = videoHeight * 0.75;
    const videoInView = event.target.scrollTop < threshold;
    this.setState(prevState => ({
      videoInView,
      fixedVideo:
        videoInView === prevState.videoInView
          ? prevState.fixedVideo
          : !videoInView
    }));
  };

  onCloseClick = () => this.setState({fixedVideo: false});

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
    const skaterIds = Object.keys(skaters);
    const letters = getInitialLetters(skaterIds);
    const opponents = {
      [skaterIds[0]]: skaters[skaterIds[1]],
      [skaterIds[1]]: skaters[skaterIds[0]]
    };

    return this.rounds.map(round => {
      let commentary;
      const attempts = filter(round);
      if (attempts.length === 1) {
        const {skater_id} = attempts[0];
        const skater = skaters[skater_id].first_name;
        const opponent = opponents[skater_id].first_name;
        commentary = `${skater} misses, ${opponent}'s turn to set`;
      }

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

                const count = letters[skater_id];
                const earned = LETTERS.slice(0, count).join('.');
                commentary = `${skaters[skater_id].first_name} gets ${earned}.`;
                if (count === 5) {
                  commentary += `, ${opponents[skater_id].first_name} wins!`;
                }
              }

              return (
                <StyledTableCell key={attempt.id} index={index}>
                  {getAttemptText(attempt)}
                </StyledTableCell>
              );
            })}
          </TableRow>
          {commentary && <Commentary>{commentary}</Commentary>}
        </Fragment>
      );
    });
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
        <DialogContent onScroll={this.props.game.video_id && this.onScroll}>
          {this.props.game.video_id && (
            <Video>
              <VideoInner fixed={this.state.fixedVideo}>
                <StyledIframe
                  allowFullScreen
                  src={`https://www.youtube.com/embed/${
                    this.props.game.video_id
                  }?rel=0&showinfo=0`}
                  frameBorder={0}
                  allow="autoplay; encrypted-media"
                />
                {this.state.fixedVideo && (
                  <CloseButton onClick={this.onCloseClick}>
                    <CloseIcon />
                  </CloseButton>
                )}
              </VideoInner>
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
