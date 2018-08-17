import ButtonBase from '@material-ui/core/ButtonBase';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormDialogContent from '../../../components/form-dialog-content';
import GameCard from './game-card';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SkaterForm from './skater-form';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import differenceInYears from 'date-fns/differenceInYears';
import theme from '@trevorblades/mui-theme';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {size} from 'polished';

const StyledTable = styled(Table)({
  marginTop: theme.spacing.unit
});

const GridItem = withProps({
  item: true,
  xs: true
})(Grid);

const BackButton = styled(ButtonBase)({
  marginBottom: theme.spacing.unit
});

const StyledChevronLeftIcon = styled(ChevronLeftIcon)(
  size(theme.typography.caption.fontSize),
  {marginLeft: theme.spacing.unit / -2}
);

const UNKNOWN = 'unknown';
const NOW = Date.now();

class SkaterDialogContent extends Component {
  static propTypes = {
    skater: PropTypes.object.isRequired
  };

  state = {
    game: null
  };

  onGameClick = game => this.setState({game});

  onBackClick = () => this.setState({game: null});

  render() {
    if (this.state.game) {
      return (
        <GameCard game={this.state.game}>
          <BackButton onClick={this.onBackClick}>
            <StyledChevronLeftIcon />
            <Typography variant="caption" color="inherit">
              Back to {this.props.skater.full_name}
            </Typography>
          </BackButton>
        </GameCard>
      );
    }

    return (
      <FormDialogContent data={this.props.skater} formComponent={SkaterForm}>
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

export default SkaterDialogContent;
