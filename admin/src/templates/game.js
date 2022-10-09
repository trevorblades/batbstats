import Header from '../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {getEventMetadata, getGameTitle, getVersus} from '../utils';
import {graphql} from 'gatsby';

export default function Game({data}) {
  const {game} = data.batbstats;
  const {numRounds} = getEventMetadata(game.event);
  const title = getGameTitle(game, numRounds);
  return (
    <>
      <Helmet title={title} />
      <Header>{title}</Header>
      {getVersus(game.skaters)}
    </>
  );
}

Game.propTypes = {
  data: PropTypes.object.isRequired
};

export const query = graphql`
  query GetGame($id: ID!) {
    batbstats {
      game(id: $id) {
        id
        round
        event {
          id
          name
          # to calculate number of rounds
          games(filter: {round: 1}) {
            round
          }
        }
        skaters {
          id
          fullName
        }
        roshambos {
          id
          round
          move
          skater {
            id
          }
        }
        attempts {
          id
          offense
          successful
          redos
          trick {
            id
            name
          }
          skater {
            id
          }
        }
      }
    }
  }
`;
