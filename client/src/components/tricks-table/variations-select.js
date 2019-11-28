import PropTypes from 'prop-types';
import React, {useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import {graphql, useStaticQuery} from 'gatsby';

export default function VariationsSelect(props) {
  const [variation, setVariation] = useState(props.defaultValue || '');
  const {variations} = useStaticQuery(
    graphql`
      {
        variations: __type(name: "BATBStats_Variation") {
          enumValues {
            name
          }
        }
      }
    `
  );

  function handleVariationChange(event) {
    setVariation(event.target.value);
  }

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Variation</InputLabel>
      <Select
        value={variation}
        onChange={handleVariationChange}
        inputProps={{name: 'variation'}}
      >
        <MenuItem value="">No variation</MenuItem>
        {variations.enumValues.map(({name}) => (
          <MenuItem value={name} key={name}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

VariationsSelect.propTypes = {
  defaultValue: PropTypes.string
};
