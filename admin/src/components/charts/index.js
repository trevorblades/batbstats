import PropTypes from 'prop-types';
import React from 'react';
import countries from './countries.json';
import {ResponsiveChoropleth} from '@nivo/geo';
import {ResponsivePie} from '@nivo/pie';
import {ResponsiveScatterPlot} from '@nivo/scatterplot';
import {useTheme} from '@nivo/core';

export function ScatterPlot({legendLeft, legendBottom, ...props}) {
  const theme = useTheme();
  return (
    <ResponsiveScatterPlot
      margin={{top: 40, right: 80, bottom: 80, left: 80}}
      axisLeft={{
        legend: legendLeft,
        legendPosition: 'middle',
        legendOffset: -60
      }}
      axisBottom={{
        legend: legendBottom,
        legendPosition: 'middle',
        legendOffset: 46
      }}
      colors={{scheme: 'category10'}}
      theme={theme}
      {...props}
    />
  );
}

ScatterPlot.propTypes = {
  legendLeft: PropTypes.string.isRequired,
  legendBottom: PropTypes.string.isRequired
};

export function Pie(props) {
  const theme = useTheme();
  return (
    <ResponsivePie
      innerRadius={0.5}
      margin={{top: 40, right: 40, bottom: 40, left: 40}}
      arcLinkLabelsColor={{from: 'color'}}
      arcLinkLabelsTextColor="currentcolor"
      colors={{scheme: 'category10'}}
      theme={theme}
      {...props}
    />
  );
}

export function Choropleth(props) {
  const theme = useTheme();
  return (
    <ResponsiveChoropleth
      theme={theme}
      features={countries.features}
      {...props}
    />
  );
}
