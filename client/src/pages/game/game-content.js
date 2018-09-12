import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Header from '../../components/header';
import PropTypes from 'prop-types';
import React, {PureComponent, Fragment} from 'react';
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
import pluralize from 'pluralize';
import sum from 'lodash/sum';
import sumBy from 'lodash/sumBy';
import styled, {css} from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import toPairs from 'lodash/toPairs';
import upperFirst from 'lodash/upperFirst';
import values from 'lodash/values';
import withProps from 'recompose/withProps';
import {ROSHAMBO_COUNTERS} from '../../../../api/common';
import {connect} from 'react-redux';
import {getRoshamboEmoji, getInitialLetters} from '../../util/game';
import {size, position} from 'polished';
import {getAverageRounds, getAverageRuns} from '../../selectors';

const Container = styled.div({
  display: 'flex'
});

const Main = styled.main({
  flexGrow: 1,
  overflowY: 'auto'
});

const sidebarWidth = 300;
const Sidebar = styled.aside({
  flexShrink: 0,
  width: sidebarWidth,
  padding: theme.spacing.unit * 3,
  backgroundColor: theme.palette.background.default
});

const aspectRatio = 16 / 9;
const Video = styled.div({
  paddingTop: `${100 / aspectRatio}%`,
  backgroundColor: theme.palette.grey[100],
  position: 'relative'
});

const closeButtonSpacing = theme.spacing.unit * 1.5;
const CloseButton = styled(Button)({
  position: 'absolute',
  top: closeButtonSpacing,
  left: closeButtonSpacing
});

const positionAbsolute = position('absolute', 0);
const StyledIframe = styled.iframe(size('100%'), positionAbsolute);

const fixedWidth = 360;
const fixedHeight = fixedWidth / aspectRatio;
const fixedSpacing = theme.spacing.unit * 3;
const fixed = css({
  width: fixedWidth,
  height: fixedHeight,
  position: 'fixed',
  bottom: fixedSpacing,
  right: sidebarWidth + fixedSpacing,
  zIndex: theme.zIndex.modal
});

const videoPadding = css({paddingBottom: fixedHeight + fixedSpacing * 2});
const StyledDialogContent = styled(DialogContent)({overflowY: 'visible'});

const VideoInner = styled.div(
  props => (props.fixed ? fixed : positionAbsolute),
  {
    [`:not(:hover) ${CloseButton}`]: {
      display: 'none'
    }
  }
);

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
  let redos = '';
  if (attempt.redos) {
    redos = ' 🔄';
    if (attempt.redos > 1) {
      redos += `x${attempt.redos}`;
    }
  }

  const {successful} = attempt;
  if (attempt.offense) {
    const text = attempt.trick.name + redos;
    return successful ? text : <s>{text}</s>;
  }

  const result = successful ? '✅' : '❌';
  return result + redos;
}

const LETTERS = 'SKATE'.split('');
class GameContent extends PureComponent {
  static propTypes = {
    averageRounds: PropTypes.number.isRequired,
    averageRuns: PropTypes.number.isRequired,
    game: PropTypes.object.isRequired
  };

  state = {
    videoInView: false,
    fixedVideo: false
  };

  onScroll = event => {
    if (this.video) {
      const threshold = this.video.offsetHeight * 0.75;
      const videoInView = event.target.scrollTop < threshold;
      this.setState(prevState => ({
        videoInView,
        fixedVideo:
          videoInView === prevState.videoInView
            ? prevState.fixedVideo
            : !videoInView
      }));
    }
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
                  <Typography variant="subheading" title={move}>
                    {getRoshamboEmoji(move)}
                  </Typography>
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

    return this.props.game.rounds.map(round => {
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

  renderSidebar() {
    const {attempts, rounds, runs, letters} = this.props.game;
    const stats = {
      'Total rounds': `${rounds.length} (avg. ${this.props.averageRounds})`,
      'Total runs': `${runs.length} (avg. ${this.props.averageRuns})`,
      'Longest run': pluralize('trick', Math.max(...runs), true),
      'Letters earned': sum(values(letters)),
      'Redos given': sumBy(attempts, 'redos')
    };

    return (
      <Sidebar>
        <Typography gutterBottom variant="title">
          Game snapshot
        </Typography>
        {Object.keys(stats).map(key => (
          <Typography gutterBottom key={key}>
            {key}: {stats[key]}
          </Typography>
        ))}
      </Sidebar>
    );
  }

  render() {
    const skaters = keyBy('id')(this.props.game.skaters);
    return (
      <Container>
        <Main onScroll={this.onScroll}>
          <Header>
            <div>
              <Typography variant="headline">
                {map(this.props.game.skaters, 'full_name').join(' vs. ')}
              </Typography>
              <Typography variant="subheading">
                {this.props.game.event.short_name} {this.props.game.round_name}
              </Typography>
            </div>
          </Header>
          <StyledDialogContent
            className={this.state.fixedVideo && videoPadding}
          >
            {this.props.game.video_id && (
              <Video
                innerRef={node => {
                  this.video = node;
                }}
              >
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
                    <CloseButton mini variant="fab" onClick={this.onCloseClick}>
                      <CloseIcon />
                    </CloseButton>
                  )}
                </VideoInner>
              </Video>
            )}
            <Table padding="dense">
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
            </Table>
          </StyledDialogContent>
        </Main>
        {this.renderSidebar()}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  averageRounds: getAverageRounds(state),
  averageRuns: getAverageRuns(state)
});

export default connect(mapStateToProps)(GameContent);
