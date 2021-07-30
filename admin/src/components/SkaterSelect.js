import React from 'react';
import sortBy from 'lodash/sortBy';
import {LIST_SKATERS} from '../utils';
import {Select} from '@chakra-ui/react';
import {useQuery} from '@apollo/client';

export default function SkaterSelect(props) {
  const {data, loading, error} = useQuery(LIST_SKATERS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Select {...props} roundedRight={0} isRequired>
      <option>Select a skater</option>
      {sortBy(data.skaters, 'fullName').map(skater => (
        <option key={skater.id} value={skater.id}>
          {skater.fullName}
        </option>
      ))}
    </Select>
  );
}
