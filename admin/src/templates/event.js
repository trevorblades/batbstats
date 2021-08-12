import Bracket, {createBracket} from '../components/Bracket';
import EventSelect from '../components/EventSelect';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {Box, Flex, Heading, Link, Text, useTheme} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {ResponsiveBar} from '@nivo/bar';
import {ResponsivePie} from '@nivo/pie';
import {getEventMetadata, getRoshamboWinner, reduceRoshambos} from '../utils';

export default function Event({data}) {
  const {colors} = useTheme();

  const theme = {
    tooltip: {
      container: {
        background: colors.gray[700]
      }
    },
    axis: {
      ticks: {
        text: {
          fill: 'currentcolor'
        }
      }
    }
  };

  const {event, events} = data.batbstats;
  const {rounds, numRounds, totalGames} = getEventMetadata(event);

  const allAttempts = event.games.flatMap(game => game.attempts);
  const successfulOffensiveAttempts = allAttempts.filter(
    attempt => attempt.offense && attempt.successful
  );

  const commonTricks = Object.entries(
    successfulOffensiveAttempts.reduce((acc, attempt) => {
      const existing = acc[attempt.trick.id];
      return {
        ...acc,
        [attempt.trick.id]: existing
          ? {
              ...existing,
              attempts: [...existing.attempts, attempt]
            }
          : {
              name: attempt.trick.name,
              attempts: [attempt]
            }
      };
    }, [])
  )
    .map(([id, {name, attempts}]) => ({
      id,
      name,
      numAttempts: attempts.length
    }))
    .sort((a, b) => b.numAttempts - a.numAttempts)
    .slice(0, 5);

  const skaters = Object.entries(
    allAttempts.reduce((acc, attempt) => {
      const existing = acc[attempt.skater.id];
      return {
        ...acc,
        [attempt.skater.id]: existing
          ? {
              ...existing,
              attempts: [...existing.attempts, attempt]
            }
          : {
              name: attempt.skater.fullName,
              stance: attempt.skater.stance,
              attempts: [attempt]
            }
      };
    }, {})
  )
    .map(([id, {name, stance, attempts}]) => {
      const successfulAttempts = attempts.filter(attempt => attempt.successful);
      const successRatio = successfulAttempts.length / attempts.length;
      return {
        id,
        name,
        stance,
        successRatio: Math.round(successRatio * 1000) / 10
      };
    })
    .sort((a, b) => b.successRatio - a.successRatio);

  const stances = Object.entries(
    skaters.reduce((acc, skater) => {
      const existing = acc[skater.stance];
      return {
        ...acc,
        [skater.stance]: existing ? [...existing, skater] : [skater]
      };
    }, {})
  ).map(([stance, skaters]) => ({
    stance,
    value: skaters.length
  }));

  const winsAfterRoshamboWin = event.games.filter(game => {
    const skaterIds = game.skaters.map(skater => skater.id);
    const roshambos = reduceRoshambos(game.roshambos);
    const [roshamboWinner] = getRoshamboWinner(roshambos, skaterIds);
    return roshamboWinner === game.result?.winner.id;
  });

  const roshamboWinRate =
    Math.round((winsAfterRoshamboWin.length / event.games.length) * 1000) / 10;

  const winnerStances = event.games
    .map(game => game.result?.winner.stance)
    .filter(Boolean);

  const stanceWins = Object.entries(
    winnerStances.reduce((acc, stance) => {
      const count = acc[stance] || 0;
      return {
        ...acc,
        [stance]: count + 1
      };
    }, {})
  ).map(([id, value]) => ({id, value}));

  return (
    <Flex direction="column">
      <Helmet title={event.name} />
      <Header title={event.name}>
        <EventSelect event={event} events={events} />
        <Link ml="3" as={GatsbyLink} to="/events">
          All events
        </Link>
      </Header>
      {event.games.length < totalGames ? (
        <Box p={5}>
          <Heading>Event not complete</Heading>
          <Text>We&apos;re working on it...</Text>
        </Box>
      ) : (
        <>
          <div>
            <Heading size="md">Most common tricks</Heading>
            <Box h="300px">
              <ResponsivePie
                data={commonTricks}
                value="numAttempts"
                id="name"
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                arcLinkLabelsColor={{from: 'color'}}
                arcLinkLabelsTextColor="currentcolor"
                theme={theme}
              />
            </Box>
          </div>
          <div>
            <Heading size="md">Most consistent skaters</Heading>
            <Box h="300px">
              <ResponsiveBar
                data={skaters}
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                keys={['successRatio']}
                theme={theme}
                indexBy="name"
                colorBy="indexValue"
                axisBottom={{tickRotation: -45}}
              />
            </Box>
          </div>
          <div>
            <Heading size="md">Stance distribution</Heading>
            <Box h="300px">
              <ResponsivePie
                data={stances}
                id="stance"
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                arcLinkLabelsColor={{from: 'color'}}
                arcLinkLabelsTextColor="currentcolor"
                theme={theme}
              />
            </Box>
          </div>
          <div>
            <Heading size="md">Wins by stance</Heading>
            <Box h="300px">
              <ResponsivePie
                data={stanceWins}
                margin={{top: 40, right: 80, bottom: 80, left: 80}}
                arcLinkLabelsColor={{from: 'color'}}
                arcLinkLabelsTextColor="currentcolor"
                theme={theme}
              />
            </Box>
          </div>
          <div>
            <Heading size="md">
              RPS winner wins the game {roshamboWinRate} % of the time
            </Heading>
          </div>
          <ScrollContainer hideScrollbars={false}>
            <Box display="inline-block" mx={5}>
              <Bracket
                game={createBracket(rounds[numRounds], numRounds, rounds)[0]}
                numRounds={numRounds}
              />
            </Box>
          </ScrollContainer>
        </>
      )}
    </Flex>
  );
}

Event.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query GetEvent($id: ID!) {
    batbstats {
      events {
        id
        name
      }
      event(id: $id) {
        id
        name
        games {
          id
          round
          skaters {
            id
            fullName
          }
          roshambos {
            round
            move
            skater {
              id
            }
          }
          replacements {
            in {
              id
              fullName
            }
            out {
              id
              fullName
            }
          }
          result {
            winner {
              id
              stance
            }
            lettersAgainst
          }
          attempts {
            offense
            successful
            trick {
              id
              name
            }
            skater {
              id
              fullName
              stance
            }
          }
        }
      }
    }
  }
`;
