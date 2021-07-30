import PropTypes from 'prop-types';
import React from 'react';
import UpdateGameForm from '../../components/UpdateGameForm';
import {GAME_FRAGMENT} from '../../utils';
import {gql, useQuery} from '@apollo/client';

const GET_GAME = gql`
  query GetGame($id: ID!) {
    game(id: $id) {
      ...GameFragment
    }
  }
  ${GAME_FRAGMENT}
`;

export default function Game({params}) {
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

  return <UpdateGameForm game={data.game} />;
}

Game.propTypes = {
  params: PropTypes.object.isRequired
};
