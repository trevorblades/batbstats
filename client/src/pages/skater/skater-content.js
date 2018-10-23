import DialogButton from '../../components/dialog-button';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterForm from './skater-form';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import countriesClient from '../../util/countries-client';
import differenceInYears from 'date-fns/differenceInYears';
import gql from 'graphql-tag';
import round from 'lodash/round';
import withProps from 'recompose/withProps';
import {Consumer} from '../../util/user-context';
import {Query} from 'react-apollo';
import {StyledDialogContent} from '../../components';
import {getAggregates, getLetters, getRoundName} from '../../util/game';
import {getShortName} from '../../util/event';
import {withRouter} from 'react-router-dom';

const GridItem = withProps({
  item: true,
  xs: 6
})(Grid);

const UNKNOWN = 'unknown';
const NOW = Date.now();

function formatPercent(percent) {
  return `${round(percent * 100, 2)} %`;
}

class SkaterContent extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    skater: PropTypes.object.isRequired
  };

  onGameClick = game => this.props.history.push(`/games/${game.id}`);

  get flipTendency() {
    const flips = this.props.skater.games.flatMap(game =>
      game.attempts.filter(attempt => attempt.offense && attempt.trick.flip)
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
    const {wins, plusMinus} = getAggregates(
      this.props.skater.games,
      this.props.skater.id
    );
    const losses = this.props.skater.games.length - wins;
    return (
      <Fragment>
        <Helmet>
          <title>{this.props.skater.full_name}</title>
        </Helmet>
        <Header>
          <Typography variant="h3">{this.props.skater.full_name}</Typography>
          <Consumer>
            {({token}) =>
              token && (
                <DialogButton title="Edit skater" variant="outlined">
                  {onClose => (
                    <SkaterForm onClose={onClose} skater={this.props.skater} />
                  )}
                </DialogButton>
              )
            }
          </Consumer>
        </Header>
        <StyledDialogContent>
          <Grid container>
            <GridItem>
              <DialogContentText>
                Country:{' '}
                {this.props.skater.country ? (
                  <Query
                    query={gql`
                      query($code: String) {
                        country(code: $code) {
                          name
                        }
                      }
                    `}
                    client={countriesClient}
                    variables={{code: this.props.skater.country}}
                  >
                    {({loading, data}) =>
                      loading ? 'Loading...' : data.country.name
                    }
                  </Query>
                ) : (
                  UNKNOWN
                )}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Age:{' '}
                {this.props.skater.birth_date
                  ? differenceInYears(NOW, Number(this.props.skater.birth_date))
                  : UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Stance: {this.props.skater.stance || UNKNOWN}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Record: {wins}-{losses}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                +/-: {plusMinus > 0 ? `+${plusMinus}` : plusMinus}
              </DialogContentText>
            </GridItem>
            <GridItem>
              <DialogContentText>
                Flip tendency: {this.flipTendency}
              </DialogContentText>
            </GridItem>
          </Grid>
          <br />
          <Table padding="none">
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
                const letters = getLetters(game.attempts);
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
                    <TableCell>{getShortName(game.event.name)}</TableCell>
                    <TableCell>{getRoundName(game.round)}</TableCell>
                    <TableCell>
                      {letters[this.props.skater.id] < 5 ? 'Win' : 'Loss'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </StyledDialogContent>
      </Fragment>
    );
  }
}

export default withRouter(SkaterContent);
