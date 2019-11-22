import Chart from './chart';
import Layout from '../layout';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import Roshambos from './roshambos';
import Rounds from './rounds';
import Summary from './summary';
import {
  Box,
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

export default function GameTemplate(props) {
  const {
    event,
    round,
    skaters,
    attempts,
    roshambos
  } = props.data.batbstats.game;

  const rounds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < attempts.length; i++) {
      let attempt = attempts[i];
      const round = {[attempt.skaterId]: attempt};
      if (attempt.successful) {
        i++;
        attempt = attempts[i];
        round[attempt.skaterId] = attempt;
      }

      arr.push(round);
    }

    return arr;
  }, [attempts]);

  const title = skaters.map(skater => skater.fullName).join(' vs. ');
  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box p={4}>
        <Typography variant="h6">
          <Link to={`/events/${event.id}`}>BATB {event.id}</Link>{' '}
          {formatRound(round)}
        </Typography>
        <Typography paragraph variant="h4">
          {title}
        </Typography>
        <Summary rounds={rounds} attempts={attempts} />
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
        <Chart rounds={rounds} skaters={skaters} />
      </Box>
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
          successful
          offense
          redos
          skaterId
          trick {
            name
            flip
            shuv
            spin
          }
        }
      }
    }
  }
`;
