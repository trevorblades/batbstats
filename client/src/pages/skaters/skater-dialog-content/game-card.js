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
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/fp/keyBy';
import map from 'lodash/map';
import mapProps from 'recompose/mapProps';
import mapValues from 'lodash/mapValues';
import styled from 'react-emotion';
import toPairs from 'lodash/toPairs';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {getRoshamboEmoji} from '../../../util/game';
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

class GameCard extends Component {
  static propTypes = {
    children: PropTypes.node,
    game: PropTypes.object.isRequired
  };

  renderRoshambos() {
    const roshambos = mapValues(
      groupBy(this.props.game.roshambos, 'round'),
      keyBy('skater_id')
    );

    const keys = Object.keys(roshambos);
    const pairs = toPairs(
      mapValues(roshambos[keys[keys.length - 1]], 'move')
    ).sort((a, b) => (ROSHAMBO_COUNTERS[a[1]] === b[1] ? 1 : -1));
    const winner = find(this.props.game.skaters, ['id', Number(pairs[0][0])]);
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
        <TableRow>
          <TableCell colSpan={2}>
            <DialogContentText align="center">
              {upperFirst(pairs[0][1])} beats {pairs[1][1]}, {winner.first_name}{' '}
              goes first
            </DialogContentText>
          </TableCell>
        </TableRow>
      </Fragment>
    );
  }

  render() {
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
        <div>
          {!this.props.game.video_id && <div />}
          <DialogContent>
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
              <TableBody>{this.renderRoshambos()}</TableBody>
            </DenseTable>
          </DialogContent>
        </div>
      </Fragment>
    );
  }
}

export default GameCard;
