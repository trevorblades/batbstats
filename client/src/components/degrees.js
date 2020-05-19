import PropTypes from 'prop-types';
import React from 'react';

export default function Degrees(props) {
  return <>{props.value * 180}&deg;</>;
}

Degrees.propTypes = {
  value: PropTypes.number
};
