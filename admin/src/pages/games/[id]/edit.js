import GameForm from '../../../components/GameForm';
import NoSSR from '@mpth/react-no-ssr';
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

function GetGame({variables}) {
  const {data, loading, error} = useQuery(GET_GAME, {
    variables
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

GetGame.propTypes = {
  variables: PropTypes.object.isRequired
};

export default function EditGame({params}) {
  return (
    <NoSSR>
      <GetGame variables={{id: params.id}} />
    </NoSSR>
  );
}

EditGame.propTypes = {
  params: PropTypes.object.isRequired
};
