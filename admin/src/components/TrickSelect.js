import PropTypes from 'prop-types';
import React from 'react';
import TrickCombobox from './TrickCombobox';
import {LIST_TRICKS} from '../utils';
import {useQuery} from '@apollo/client';

export default function TrickSelect({onTrickChange, abd}) {
  const {data, loading, error} = useQuery(LIST_TRICKS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <TrickCombobox
      tricks={data.tricks}
      abd={abd}
      onChange={({selectedItem}) => onTrickChange(selectedItem)}
    />
  );
}

TrickSelect.propTypes = {
  abd: PropTypes.array.isRequired,
  onTrickChange: PropTypes.func.isRequired
};
