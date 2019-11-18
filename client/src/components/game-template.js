import Layout from './layout';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
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
import {formatRound} from '../utils';
import {graphql} from 'gatsby';

// TODO: clean this up/request from API
const ROSHAMBO_COUNTERS = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock'
};

function Commentary(props) {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <Typography color="textSecondary" align="center">
          {props.children}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

Commentary.propTypes = {
  children: PropTypes.node.isRequired
};

export default function GameTemplate(props) {
  const {event, round, skaters, roshambos} = props.data.batbstats.game;
  const title = skaters.map(skater => skater.fullName).join(' vs. ');

  function renderRoshambos(skaters) {
    const roshamboMap = roshambos.reduce((acc, roshambo) => {
      const moves = acc[roshambo.round];
      if (moves) {
        return {
          ...acc,
          [roshambo.round]: {
            ...moves,
            [roshambo.skaterId]: roshambo.move
          }
        };
      }

      return {
        ...acc,
        [roshambo.round]: {
          [roshambo.skaterId]: roshambo.move
        }
      };
    }, {});

    const keys = Object.keys(roshamboMap);
    const lastRound = roshamboMap[keys[keys.length - 1]];
    const pairs = Object.entries(lastRound).sort((a, b) =>
      ROSHAMBO_COUNTERS[a[1]] === b[1] ? 1 : -1
    );

    const winningMove = pairs[0][1];
    const winnerId = pairs[0][0];
    const winner = skaters.find(skater => skater.id === winnerId);
    return (
      <Fragment>
        {keys.map(key => (
          <TableRow key={key}>
            {skaters.map((skater, index) => {
              const move = roshamboMap[key][skater.id];
              return (
                <TableCell key={skater.id} index={index}>
                  <Typography variant="subtitle1" title={move}>
                    {move}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        ))}
        <Commentary>
          {winningMove.charAt(0).toUpperCase() + winningMove.slice(1)} beats{' '}
          {pairs[1][1]}, {winner.firstName} goes first
        </Commentary>
      </Fragment>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Typography gutterBottom variant="h4">
        <Link to={`/events/${event.id}`}>{event.name}</Link>{' '}
        {formatRound(round)}
      </Typography>
      <Typography variant="h6">{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            {skaters.map((skater, index) => (
              <TableCell key={skater.id} index={index}>
                {skater.fullName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {renderRoshambos(skaters)}
          {/* 
          {this.renderRounds(skaters)} */}
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
        id
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
          id
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
