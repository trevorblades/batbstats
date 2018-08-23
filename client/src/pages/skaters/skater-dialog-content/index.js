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
import differenceInYears from 'date-fns/differenceInYears';
import theme from '@trevorblades/mui-theme';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
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
  'hometown',
  'birth_date',
  'updated_at'
);

class SkaterDialogContent extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    skater: PropTypes.object.isRequired
  };

  onGameClick = game => this.props.history.push(`/games/${game.id}`);

  render() {
    return (
      <FormDialogContent
        data={this.props.skater}
        form={SkaterForm}
        isEqual={isEqualWithKeys}
      >
        <DialogTitle>{this.props.skater.full_name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={theme.spacing.unit * 2}>
            <GridItem>
              <DialogContentText>
                Record: {this.props.skater.wins}-{this.props.skater.losses}
              </DialogContentText>
              <DialogContentText>
                Hometown: {this.props.skater.hometown || UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Stance: {this.props.skater.stance || UNKNOWN}
              </DialogContentText>
              {this.props.skater.birth_date && (
                <DialogContentText>
                  Age: {differenceInYears(NOW, this.props.skater.birth_date)}
                </DialogContentText>
              )}
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
              {this.props.skater.games.map(game => {
                const {event} = game;
                const opponent = game.skaters.find(
                  skater => skater.id !== this.props.skater.id
                );
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
