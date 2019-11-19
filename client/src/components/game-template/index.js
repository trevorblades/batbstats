import Layout from '../layout';
import PropTypes from 'prop-types';
import React from 'react';
import Roshambos from './roshambos';
import Rounds from './rounds';
import {
  Card,
  CardContent,
  Grid,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {Link} from 'gatsby-theme-material-ui';
import {formatRound} from '../../utils';
import {graphql} from 'gatsby';

function getRounds(attempts) {
  const rounds = [];
  for (let i = 0; i < attempts.length; i++) {
    let attempt = attempts[i];
    const round = {[attempt.skaterId]: attempt};
    if (attempt.successful) {
      i++;
      attempt = attempts[i];
      round[attempt.skaterId] = attempt;
    }

    rounds.push(round);
  }

  return rounds;
}

function StatListItem(props) {
  return (
    <Grid item xs={12} sm={6} md={12}>
      <ListItemText secondary={props.label}>{props.children}</ListItemText>
    </Grid>
  );
}

StatListItem.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default function GameTemplate(props) {
  const {
    event,
    round,
    skaters,
    attempts,
    roshambos
  } = props.data.batbstats.game;

  const rounds = getRounds(attempts);
  const title = skaters.map(skater => skater.fullName).join(' vs. ');
  const redos = attempts.reduce((acc, attempt) => acc + attempt.redos, 0);

  const successfulAttempts = attempts.filter(attempt => attempt.successful);
  const accuracy = successfulAttempts.length / attempts.length;

  const tricks = successfulAttempts
    .filter(attempt => attempt.offense)
    .map(attempt => attempt.trick);
  const flips = tricks.reduce((acc, trick) => acc + Math.abs(trick.flip), 0);

  const runs = attempts
    .reduce(
      (acc, attempt) => {
        if (attempt.offense) {
          return attempt.successful
            ? [...acc.slice(0, -1), acc[acc.length - 1] + 1]
            : [...acc, 0];
        }

        // return the existing run state if attempt was in defense
        return acc;
      },
      [0]
    )
    // runs are more than one trick in a row
    .filter(run => run > 1);

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Typography gutterBottom variant="h4">
        <Link to={`/events/${event.id}`}>BATB {event.id}</Link>{' '}
        {formatRound(round)}
      </Typography>
      <Typography paragraph variant="h6">
        {title}
      </Typography>
      <Grid container spacing={3} direction="row-reverse">
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography gutterBottom variant="h6">
                Battle summary
              </Typography>
              <Grid container spacing={1}>
                <StatListItem label="Total rounds">
                  {rounds.length}
                </StatListItem>
                <StatListItem label="Overall accuracy">
                  {Math.round(accuracy * 1000) / 10} %
                </StatListItem>
                <StatListItem label="Total runs">{runs.length}</StatListItem>
                <StatListItem label="Longest run">
                  {Math.max(...runs)} tricks
                </StatListItem>
                <StatListItem label="Redos given">{redos}</StatListItem>
                <StatListItem label="Avg. flips per trick">
                  {flips / tricks.length}
                </StatListItem>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Table style={{tableLayout: 'fixed'}}>
            <TableHead>
              <TableRow>
                {skaters.map((skater, index) => (
                  <TableCell key={skater.id} align={index ? 'left' : 'right'}>
                    {skater.fullName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <Roshambos roshambos={roshambos} skaters={skaters} />
              <Rounds rounds={rounds} skaters={skaters} />
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Layout>
  );
}

GameTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query GameQuery($id: ID!) {
    batbstats {
      game(id: $id) {
        round
        event {
          id
        }
        skaters {
          id
          firstName
          fullName
        }
        roshambos {
          round
          move
          skaterId
        }
        attempts {
          id
          successful
          offense
          redos
          skaterId
          trick {
            id
            name
            flip
          }
        }
      }
    }
  }
`;
