import Header from '../components/Header';
import PropTypes from 'prop-types';
import React from 'react';
import {Helmet} from 'react-helmet';
import {getGameTitle, getVersus} from '../utils';
import {graphql} from 'gatsby';

export default function Game({data}) {
  const {game} = data.batbstats;
  const title = getGameTitle(game);
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
