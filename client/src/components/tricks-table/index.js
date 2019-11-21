import React from 'react';
import TrickRow from './trick-row';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import {gql, useQuery} from '@apollo/client';

const LIST_TRICKS = gql`
  {
    tricks {
      id
      name
      flip
      shuv
      spin
    }
  }
`;

export default function TricksTable() {
  const {data, loading, error} = useQuery(LIST_TRICKS);

  if (loading || error) {
    return (
      <Typography color={error ? 'error' : 'textSecondary'}>
        {error ? error.message : 'Loading tricks...'}
      </Typography>
    );
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="none">Trick name</TableCell>
          <TableCell align="right">Flip</TableCell>
          <TableCell align="right">Spin</TableCell>
          <TableCell align="right">Shuv</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.tricks.map(trick => (
          <TrickRow key={trick.id} trick={trick} />
        ))}
      </TableBody>
    </Table>
  );
}
