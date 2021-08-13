import Bracket, {createBracket} from '../components/Bracket';
import EventSelect from '../components/EventSelect';
import Header from '../components/Header';
import PropTypes from 'prop-types';
import React, {useMemo} from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import {
  Box,
  Flex,
  Heading,
  Link,
  SimpleGrid,
  Text,
  useColorModeValue,
  useTheme
} from '@chakra-ui/react';
import {Link as GatsbyLink, graphql} from 'gatsby';
import {Helmet} from 'react-helmet';
import {ResponsivePie} from '@nivo/pie';
import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import {getEventMetadata, getRoshamboWinner, reduceRoshambos} from '../utils';

const sortByStance = (a, b) =>
  a.stance === b.stance ? 0 : a.stance > b.stance ? 1 : -1;

export default function Event({data}) {
  const {colors} = useTheme();
  const tooltipBgShade = useColorModeValue(50, 700);

  const theme = useMemo(
    () => ({
      tooltip: {
        container: {
          background: colors.gray[tooltipBgShade]
        }
      },
      axis: {
        ticks: {
          text: {
            fill: 'currentcolor'
          }
        },
        legend: {
          text: {
            fill: 'currentcolor'
          }
        }
      }
    }),
    [colors, tooltipBgShade]
  );

  const {event, events} = data.batbstats;
  const {rounds, numRounds, totalGames} = getEventMetadata(event);

  const allAttempts = event.games.flatMap(game => game.attempts);

  const {deadly, common} = allAttempts.reduce(
    (acc, attempt) => {
      if (attempt.offense ? !attempt.successful : attempt.successful) {
        return acc;
      }

      const key = attempt.offense ? 'common' : 'deadly';
      const existing = acc[key][attempt.trick.id];
      return {
        ...acc,
        [key]: {
          ...acc[key],
          [attempt.trick.id]: existing
            ? {
                ...existing,
                attempts: [...existing.attempts, attempt]
              }
            : {
                name: attempt.trick.name,
                attempts: [attempt]
              }
        }
      };
    },
    {deadly: {}, common: {}}
  );

  const [commonTricks, deadlyTricks] = [common, deadly].map(tricks =>
    Object.entries(tricks)
      .map(([id, {name, attempts}]) => ({
        id,
        name,
        numAttempts: attempts.length
      }))
      .sort((a, b) => b.numAttempts - a.numAttempts)
      .slice(0, 10)
  );

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
  ).map(([id, {name, stance, attempts}]) => {
    const successfulAttempts = attempts.filter(attempt => attempt.successful);
    const totalAttempts = attempts.length;
    return {
      id,
      name,
      stance,
      totalAttempts,
      successRatio: successfulAttempts.length / totalAttempts
    };
  });

  const stances = Object.entries(
    skaters.reduce((acc, skater) => {
      const existing = acc[skater.stance];
      return {
        ...acc,
        [skater.stance]: existing ? [...existing, skater] : [skater]
      };
    }, {})
  )
    .map(([stance, skaters]) => ({
      stance,
      value: skaters.length
    }))
    .sort(sortByStance);

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
  )
    .map(([stance, value]) => ({stance, value}))
    .sort(sortByStance);

  const minY = Math.min(...skaters.map(skater => skater.successRatio));
  const scatterPlotData = skaters.map(skater => ({
    id: skater.name,
    data: [
      {
        x: skater.totalAttempts,
        y: skater.successRatio
      }
    ]
  }));

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
          <SimpleGrid p={6} columns={2} spacing={8}>
            <div>
              <Heading size="md">Most common tricks</Heading>
              <Box h="300px">
                <ResponsivePie
                  data={commonTricks}
                  value="numAttempts"
                  id="name"
                  innerRadius={0.5}
                  margin={{top: 40, right: 40, bottom: 40, left: 40}}
                  arcLinkLabelsColor={{from: 'color'}}
                  arcLinkLabelsTextColor="currentcolor"
                  theme={theme}
                  colors={{scheme: 'accent'}}
                />
              </Box>
            </div>
            <div>
              <Heading size="md">Most deadly tricks</Heading>
              <Box h="300px">
                <ResponsivePie
                  data={deadlyTricks}
                  value="numAttempts"
                  id="name"
                  innerRadius={0.5}
                  margin={{top: 40, right: 40, bottom: 40, left: 40}}
                  arcLinkLabelsColor={{from: 'color'}}
                  arcLinkLabelsTextColor="currentcolor"
                  theme={theme}
                  colors={{scheme: 'accent'}}
                />
              </Box>
            </div>
            <Box gridColumn="1 / 3">
              <Heading size="md">Most consistent skaters</Heading>
              <Box h="300px">
                <ResponsiveScatterPlot
                  data={scatterPlotData}
                  margin={{top: 40, right: 80, bottom: 80, left: 80}}
                  axisLeft={{
                    legend: 'success rate',
                    legendPosition: 'middle',
                    legendOffset: -60
                  }}
                  axisBottom={{
                    legend: 'total attempts',
                    legendPosition: 'middle',
                    legendOffset: 46
                  }}
                  yFormat={value => value.toPrecision(3)}
                  yScale={{
                    type: 'linear',
                    min: Math.max(minY - 0.1, 0),
                    max: 'auto'
                  }}
                  theme={theme}
                />
              </Box>
            </Box>
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
                  id="stance"
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
          </SimpleGrid>
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
