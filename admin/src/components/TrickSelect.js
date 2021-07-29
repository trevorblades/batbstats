import PropTypes from 'prop-types';
import React from 'react';
import sortBy from 'lodash/sortBy';
import {LIST_TRICKS} from '../utils';
import {Select} from '@chakra-ui/react';
import {useQuery} from '@apollo/client';

export default function TrickSelect({value, onTrickChange, abd}) {
  const {data, loading, error} = useQuery(LIST_TRICKS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Select
      value={value}
      onChange={event => {
        const {value} = event.target;
        const trick = value
          ? data.tricks.find(trick => trick.id === value)
          : null;
        onTrickChange(trick);
      }}
      roundedRight={0}
    >
      <option>Select a trick</option>
      {sortBy(
        data.tricks.filter(trick => !abd.includes(trick.id)),
        ['flip', 'spin', 'shuv']
      ).map(trick => (
        <option key={trick.id} value={trick.id}>
          {trick.name}
        </option>
      ))}
    </Select>
  );
}

TrickSelect.propTypes = {
  abd: PropTypes.array.isRequired,
  onTrickChange: PropTypes.func.isRequired,
  value: PropTypes.string
};
