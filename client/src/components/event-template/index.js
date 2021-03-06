import Bracket from './bracket';
import Header from '../header';
import Layout from '../layout';
import PropTypes from 'prop-types';
import React from 'react';
import getBye from '../../utils/get-bye';
import {Box, Typography} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {getInitialLetters} from '../../utils';
import {graphql} from 'gatsby';

export default function EventTemplate(props) {
  const {name, games} = props.data.batbstats.event;
  return (
    <Layout>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <Header />
      <Box p={4} pb={1}>
        <Typography variant="h4">{name}</Typography>
      </Box>
      <Bracket
        games={games.map(game => {
          const initialLetters = getInitialLetters(game.skaters);
          const letters = game.attempts.reduce((acc, attempt) => {
            // increment letter count if attempt was in defense and unsuccessful
            if (!attempt.offense && !attempt.successful) {
              return {
                ...acc,
                [attempt.skater.id]: acc[attempt.skater.id] + 1
              };
            }

            return acc; // otherwise return existing counts
          }, initialLetters);

          return {
            ...game,
            letters,
            bye: getBye(game.replacements)
          };
        })}
      />
    </Layout>
  );
}

EventTemplate.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  query EventQuery($id: ID!) {
    batbstats {
      event(id: $id) {
        id
        name
        games {
          id
          round
          skaters {
            id
            fullName
            country
            stance
          }
          replacements {
            in {
              id
            }
            out {
              id
            }
          }
          attempts {
            offense
            successful
            skater {
              id
            }
            trick {
              id
              variation
              flip
              spin
            }
          }
        }
      }
    }
  }
`;
