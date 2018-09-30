import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormDialogContent from '../../../../components/form-dialog-content';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SkaterForm from './skater-form';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import differenceInYears from 'date-fns/differenceInYears';
import round from 'lodash/round';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {countries} from 'countries-list';
import {createIsEqualWithKeys} from '../../../../util';
import {withRouter} from 'react-router-dom';

const StyledTable = styled(Table)({
  marginTop: theme.spacing.unit
});

const GridItem = withProps({
  item: true,
  xs: 6
})(Grid);

const UNKNOWN = 'unknown';
const NOW = Date.now();

const isEqualWithKeys = createIsEqualWithKeys(
  'first_name',
  'last_name',
  'stance',
  'country',
  'birth_date',
  'updated_at'
);

function formatPercent(percent) {
  return `${round(percent * 100, 2)} %`;
}

class SkaterDialogContent extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    skater: PropTypes.object.isRequired
  };

  onGameClick = game => this.props.history.push(`/games/${game.id}`);

  get plusMinus() {
    const plusMinus =
      this.props.skater.letters_for - this.props.skater.letters_against;
    return plusMinus > 0 ? `+${plusMinus}` : plusMinus;
  }

  get flipTendency() {
    const flips = this.props.skater.attempts.filter(
      attempt => attempt.offense && attempt.trick.flip
    );
    if (!flips.length) {
      return 'N/A';
    }

    const kickflips = flips.filter(attempt => attempt.trick.flip > 0);
    const percent = kickflips.length / flips.length;
    if (percent === 0.5) {
      return formatPercent(percent);
    }

    const isKickflip = percent > 0.5;
    const normalized = isKickflip ? percent : 1 - percent;
    return `${isKickflip ? 'K' : 'H'} ${formatPercent(normalized)}`;
  }

  render() {
    const {
      id,
      full_name,
      country,
      stance,
      wins,
      losses,
      birth_date,
      games
    } = this.props.skater;
    return (
      <FormDialogContent
        data={this.props.skater}
        form={SkaterForm}
        isEqual={isEqualWithKeys}
      >
        <DialogTitle>{full_name}</DialogTitle>
        <DialogContent>
          <Grid container>
            <GridItem>
              <DialogContentText>
                Country: {country ? countries[country].name : UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Age: {birth_date ? differenceInYears(NOW, birth_date) : UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>Stance: {stance || UNKNOWN}</DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Record: {wins}-{losses}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>+/-: {this.plusMinus}</DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Flip tendency: {this.flipTendency}
              </DialogContentText>
            </GridItem>
          </Grid>
          <StyledTable padding="none">
            <TableHead>
              <TableRow>
                <TableCell>Opponent</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>Round</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map(game => {
                const {event} = game;
                const opponent = game.skaters.find(skater => skater.id !== id);
                return (
                  <TableRow
                    hover
                    key={game.id}
                    onClick={() => this.onGameClick(game)}
                  >
                    <TableCell>{opponent.full_name}</TableCell>
                    <TableCell>{event.short_name}</TableCell>
                    <TableCell>{game.round_name}</TableCell>
                    <TableCell>{game.win ? 'Win' : 'Loss'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </StyledTable>
        </DialogContent>
      </FormDialogContent>
    );
  }
}

export default withRouter(SkaterDialogContent);
