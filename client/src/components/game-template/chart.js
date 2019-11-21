import PropTypes from 'prop-types';
import React from 'react';
import {Box, useTheme} from '@material-ui/core';
import {
  CartesianGrid,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

export default function Chart(props) {
  const {palette} = useTheme();
  const data = props.rounds.reduce((acc, round, index) => {
    const [lastRound = {}] = acc.slice(-1);
    const results = Object.entries(round).reduce(
      (acc2, [skaterId, attempt]) => {
        return {
          ...acc2,
          [skaterId]: attempt.successful ? (lastRound[skaterId] || 0) + 1 : 0
        };
      },
      {}
    );

    return [
      ...acc,
      {
        ...lastRound,
        round: index + 1,
        ...results
      }
    ];
  }, []);

  const axisProps = {
    tick: {fill: palette.text.secondary},
    axisLine: {stroke: palette.text.secondary},
    tickLine: {stroke: palette.text.secondary}
  };

  return (
    <Box mt={3}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid stroke={palette.divider} strokeDasharray="5 5" />
          <XAxis dataKey="name" {...axisProps} />
          <YAxis {...axisProps}>
            <Label angle={-90} position="insideLeft">
              Run length
            </Label>
          </YAxis>
          <Legend
            formatter={skaterId => {
              const skater = props.skaters.find(
                skater => skater.id === skaterId
              );
              return skater.fullName;
            }}
          />
          {props.skaters.map((skater, index) => (
            <Line
              key={skater.id}
              isAnimationActive={false}
              dataKey={skater.id}
              stroke={palette[index ? 'secondary' : 'primary'].main}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

Chart.propTypes = {
  skaters: PropTypes.array.isRequired,
  rounds: PropTypes.array.isRequired
};
