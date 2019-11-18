import PropTypes from 'prop-types';
import React from 'react';
import {TableCell, TableRow, Typography} from '@material-ui/core';

export default function Commentary(props) {
  return (
    <TableRow>
      <TableCell colSpan={2}>
        <Typography color="textSecondary" align="center">
          {props.children}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

Commentary.propTypes = {
  children: PropTypes.node.isRequired
};
