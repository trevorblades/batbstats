import PropTypes from 'prop-types';
import React, {Fragment} from 'react';

export default function Degrees(props) {
  return <Fragment>{props.value * 180}&deg;</Fragment>;
}

Degrees.propTypes = {
  value: PropTypes.number
};
