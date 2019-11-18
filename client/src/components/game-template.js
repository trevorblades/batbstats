import Layout from './layout';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
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
import {ReactComponent as Paper} from 'twemoji/2/svg/270b.svg';
import {ReactComponent as Rock} from 'twemoji/2/svg/270a.svg';
import {ReactComponent as Scissors} from 'twemoji/2/svg/270c.svg';
import {formatRound} from '../utils';
import {graphql} from 'gatsby';

const ROSHAMBOS = {
  rock: {
    emoji: Rock,
    counter: 'paper'
  },
  paper: {
    emoji: Paper,
    counter: 'scissors'
  },
  scissors: {
    emoji: Scissors,
    counter: 'rock'
  }
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

function Roshambos(props) {
  const roshamboMap = props.roshambos.reduce((acc, roshambo) => {
    const moves = acc[roshambo.round];
    const move = {[roshambo.skaterId]: roshambo.move};
    if (moves) {
      return {
        ...acc,
        [roshambo.round]: {
          ...moves,
          ...move
        }
      };
    }

    return {
      ...acc,
      [roshambo.round]: move
    };
  }, {});

  const roshamboKeys = Object.keys(roshamboMap);
  const lastRound = roshamboMap[roshamboKeys[roshamboKeys.length - 1]];
  const [[winnerId, winningMove], loser] = Object.entries(lastRound).sort(
    (a, b) => {
      const {counter} = ROSHAMBOS[a[1]];
      return counter === b[1] ? 1 : -1;
    }
  );

  const winner = props.skaters.find(skater => skater.id === winnerId);
  return (
    <Fragment>
      {roshamboKeys.map(key => (
        <TableRow key={key}>
          {props.skaters.map((skater, index) => {
            const move = roshamboMap[key][skater.id];
            const {emoji} = ROSHAMBOS[move];
            return (
              <TableCell key={skater.id} align={index ? 'left' : 'right'}>
                <Typography title={move}>
                  <Box component={emoji} width={32} height={32} />
                </Typography>
              </TableCell>
            );
          })}
        </TableRow>
      ))}
      <Commentary>
        {winningMove.charAt(0).toUpperCase() + winningMove.slice(1)} beats{' '}
        {loser[1]}, {winner.firstName} goes first
      </Commentary>
    </Fragment>
  );
}

Roshambos.propTypes = {
  roshambos: PropTypes.array.isRequired,
  skaters: PropTypes.array.isRequired
};

export default function GameTemplate(props) {
  const {event, round, skaters, roshambos} = props.data.batbstats.game;
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
          {/* {this.renderRounds(skaters)} */}
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
