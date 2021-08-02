import PropTypes from 'prop-types';
import React from 'react';
import {Select} from '@chakra-ui/react';
import {navigate} from 'gatsby';

export default function EventSelect({event, events, path}) {
  return (
    <Select
      w="auto"
      size="sm"
      fontSize="md"
      value={event.id}
      rounded="md"
      onChange={event =>
        navigate(
          ['/events', event.target.value, path].filter(Boolean).join('/')
        )
      }
    >
      {events.map(event => (
        <option key={event.id} value={event.id}>
          {event.name}
        </option>
      ))}
    </Select>
  );
}

EventSelect.propTypes = {
  event: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  path: PropTypes.string
};
