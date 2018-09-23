import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormDialogContent from '../../../components/form-dialog-content';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SkaterForm from './skater-form';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import countBy from 'lodash/countBy';
import differenceInYears from 'date-fns/differenceInYears';
import find from 'lodash/find';
import maxBy from 'lodash/maxBy';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import uniqBy from 'lodash/uniqBy';
import withProps from 'recompose/withProps';
import {countries} from 'countries-list';
import {createIsEqualWithKeys} from '../../../util';
import {withRouter} from 'react-router-dom';

const StyledTable = styled(Table)({
  marginTop: theme.spacing.unit
});

const GridItem = withProps({
  item: true,
  xs: true
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

  get favouriteLeadOff() {
    const leadOffs = [];
    this.props.skater.games.forEach(game => {
      const leadOff = find(game.attempts, {
        skater_id: this.props.skater.id,
        offense: true
      });
      if (leadOff) {
        leadOffs.push(leadOff.trick);
      }
    });

    const counts = countBy(leadOffs, 'id');
    return maxBy(
      uniqBy(leadOffs, 'id').map(trick => ({
        ...trick,
        count: counts[trick.id]
      })),
      'count'
    );
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
          <DialogContentText>
            Country: {country ? countries[country].name : UNKNOWN}
          </DialogContentText>
          <Grid container spacing={theme.spacing.unit * 2}>
            <GridItem>
              <DialogContentText>Stance: {stance || UNKNOWN}</DialogContentText>
              <DialogContentText>
                Record: {wins}-{losses}
              </DialogContentText>
            </GridItem>
            <GridItem>
              {birth_date && (
                <DialogContentText>
                  Age: {differenceInYears(NOW, birth_date)}
                </DialogContentText>
              )}
              <DialogContentText>+/-: {this.plusMinus}</DialogContentText>
            </GridItem>
          </Grid>
          {this.favouriteLeadOff && (
            <DialogContentText>
              Favourite lead-off: {this.favouriteLeadOff.name}
            </DialogContentText>
          )}
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
