import Bracket from './bracket';
import Layout from '../layout';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {Typography} from '@material-ui/core';
import {getBye, getLetters} from '../../utils';
import {graphql} from 'gatsby';

export default function EventTemplate(props) {
  const {name, games} = props.data.batbstats.event;
  return (
    <Layout>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <Typography gutterBottom variant="h4">
        {name}
      </Typography>
      <Bracket
        games={games.map(game => ({
          ...game,
          bye: getBye(game.replacements),
          letters: getLetters(game.attempts)
        }))}
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
            inId
            outId
          }
          attempts {
            offense
            successful
            skaterId # TODO: use skater.id
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
