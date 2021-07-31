import GameForm from '../../../components/GameForm';
import PropTypes from 'prop-types';
import React from 'react';
import {GAME_FRAGMENT} from '../../../utils';
import {gql, useQuery} from '@apollo/client';

const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      ...GameFragment
    }
  }
  ${GAME_FRAGMENT}
`;

export default function EditGame({params}) {
  const {data, loading, error} = useQuery(GET_GAME, {
    variables: {id: params.id}
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data.game) {
    return <div>Game not found</div>;
  }

  return <GameForm game={data.game} />;
}

EditGame.propTypes = {
  params: PropTypes.object.isRequired
};
