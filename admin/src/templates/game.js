import React from 'react';
import {graphql} from 'gatsby';

export default function Game() {
  return <div>test</div>;
}

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
