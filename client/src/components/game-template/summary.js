import Degrees from '../degrees';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {Box, Grid, ListItemText, Tooltip, Typography} from '@material-ui/core';

function StatListItem(props) {
  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <ListItemText secondary={props.label}>{props.children}</ListItemText>
    </Grid>
  );
}

StatListItem.propTypes = {
  label: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired
};

export default function Summary(props) {
  const redos = props.attempts.reduce((acc, attempt) => acc + attempt.redos, 0);
  const successfulAttempts = props.attempts.filter(
    attempt => attempt.successful
  );
  const accuracy = successfulAttempts.length / props.attempts.length;

  const combined = successfulAttempts.reduce(
    (acc, attempt) =>
      Object.entries(acc).reduce(
        (acc2, [key, value]) => ({
          ...acc2,
          [key]: value + Math.abs(attempt.trick[key])
        }),
        acc
      ),
    {flip: 0, spin: 0, shuv: 0}
  );

  const runs = props.attempts
    .reduce(
      (acc, attempt) => {
        if (attempt.offense) {
          return attempt.successful
            ? [...acc.slice(0, -1), acc[acc.length - 1] + 1]
            : [...acc, 0];
        }

        // return the existing run state if attempt was in defense
        return acc;
      },
      [0]
    )
    // runs are more than one trick in a row
    .filter(run => run > 1);

  return (
    <Box
      my={3}
      p={2}
      border={1}
      borderColor="divider"
      borderRadius="borderRadius"
      bgcolor="background.paper"
    >
      <Typography gutterBottom variant="h6">
        Battle summary
      </Typography>
      <Grid container spacing={1}>
        <StatListItem label="Total rounds">{props.rounds.length}</StatListItem>
        <StatListItem label="Tricks landed">
          {successfulAttempts.length}
        </StatListItem>
        <StatListItem label="Overall accuracy">
          {Math.round(accuracy * 1000) / 10} %
        </StatListItem>
        <StatListItem
          label={
            <Fragment>
              Total runs (
              <Tooltip title="2 or more consecutive offensive lands">
                <Box component="span">?</Box>
              </Tooltip>
              )
            </Fragment>
          }
        >
          {runs.length}
        </StatListItem>
        <StatListItem label="Longest run">
          {Math.max(...runs)} tricks
        </StatListItem>
        <StatListItem label="Redos given">{redos}</StatListItem>
        <StatListItem label="Combined flips">{combined.flip}</StatListItem>
        <StatListItem label="Combined shuvs">
          <Degrees value={combined.shuv} />
        </StatListItem>
        <StatListItem label="Combined rotation">
          <Degrees value={combined.spin} />
        </StatListItem>
      </Grid>
    </Box>
  );
}

Summary.propTypes = {
  attempts: PropTypes.array.isRequired,
  rounds: PropTypes.array.isRequired
};
