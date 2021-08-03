import PropTypes from 'prop-types';
import React from 'react';
import {LIST_SKATERS} from '../utils';
import {Select} from '@chakra-ui/react';
import {useQuery} from '@apollo/client';

export default function SkaterSelect({selected, ...props}) {
  const {data, loading, error} = useQuery(LIST_SKATERS);
  return (
    <Select isInvalid={error} isDisabled={loading} {...props}>
      <option value="">Select a skater</option>
      {data?.skaters
        .filter(skater => !selected.includes(skater.id))
        .map(skater => (
          <option key={skater.id} value={skater.id}>
            {skater.fullName}
          </option>
        ))}
    </Select>
  );
}

SkaterSelect.propTypes = {
  selected: PropTypes.array.isRequired
};
