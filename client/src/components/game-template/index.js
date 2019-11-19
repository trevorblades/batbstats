import Layout from '../layout';
import PropTypes from 'prop-types';
import React from 'react';
import Roshambos from './roshambos';
import Rounds from './rounds';
import {Helmet} from 'react-helmet';
import {Link} from 'gatsby-theme-material-ui';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
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
  const title = skaters.map(skater => skater.fullName).join(' vs. ');
  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Typography gutterBottom variant="h4">
        <Link to={`/events/${event.id}`}>{event.name}</Link>{' '}
        {formatRound(round)}
      </Typography>
      <Typography paragraph variant="h6">
        {title}
      </Typography>
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
          <Rounds attempts={attempts} skaters={skaters} />
        </TableBody>
      </Table>
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
          name
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
