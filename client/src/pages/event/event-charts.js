import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, {Component, Fragment} from 'react';
import countBy from 'lodash/countBy';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import mapProps from 'recompose/mapProps';
import styled, {css} from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import uniq from 'lodash/uniq';
import upperFirst from 'lodash/upperFirst';
import {ResponsiveLine} from '@nivo/line';
import {ResponsivePie} from '@nivo/pie';
import {STANCES} from '../../../../api/common';
import {size} from 'polished';

const blockSvg = css({
  svg: {
    display: 'block'
  }
});

const PrimaryChart = styled.div(blockSvg, {
  height: 350
});

const SecondaryChart = styled.div({
  display: 'flex',
  flexShrink: 0,
  backgroundColor: theme.palette.background.default
});

const symbolSize = 12;
const tickSize = 5;
const leftAxisOffset = 40;
const bottomAxisOffset = 36;
const chartMargin = theme.spacing.unit * 4;

const PieContainer = styled.div(blockSvg, size(250));
const Filters = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  flexGrow: 1,
  padding: chartMargin,
  paddingLeft: 0
});

const RadioLabel = mapProps(props => ({
  ...props,
  control: <Radio />,
  label: upperFirst(props.value)
}))(FormControlLabel);

const COLORS = 'category10';
class EventCharts extends Component {
  static propTypes = {
    attempts: PropTypes.array.isRequired
  };

  state = {
    mode: 'stance',
    posture: 'both',
    result: 'both',
    stance: 'both'
  };

  get iteratee() {
    switch (this.state.mode) {
      case 'stance':
        return attempt => attempt.trick.variation || 'none';
      case 'flip':
        return attempt => {
          const {flip} = attempt.trick;
          if (!flip) {
            return 'none';
          }

          return flip > 0 ? 'kickflip' : 'heelflip';
        };
      case 'spin':
        return attempt => {
          const {spin} = attempt.trick;
          if (!spin) {
            return 'none';
          }

          return spin > 0 ? 'backside' : 'frontside';
        };
      default:
        return null;
    }
  }

  onRadioChange = event =>
    this.setState({[event.target.name]: event.target.value});

  onModeChange = event => this.setState({mode: event.target.value});

  render() {
    const attempts = this.props.attempts.filter(
      attempt =>
        (this.state.stance === 'both' ||
          attempt.skater.stance === this.state.stance) &&
        (this.state.result === 'both' ||
          attempt.successful === (this.state.result === 'miss')) &&
        (this.state.posture === 'both' ||
          attempt.offense === (this.state.posture === 'offense'))
    );

    const groups = groupBy(attempts, this.iteratee);
    const rounds = uniq(map(attempts, 'round')).sort();
    const lineData = Object.keys(groups)
      .sort()
      .map(key => {
        const counts = groupBy(groups[key], 'round');
        return {
          id: key,
          data: rounds.map(round => ({
            x: round,
            y: counts[round] ? counts[round].length : 0
          }))
        };
      });

    const counts = countBy(attempts, this.iteratee);
    const pieData = Object.keys(counts)
      .sort()
      .map(key => ({
        id: key,
        label: key,
        value: counts[key]
      }));

    return (
      <Fragment>
        <PrimaryChart>
          <ResponsiveLine
            colors={COLORS}
            data={lineData}
            margin={{
              top: chartMargin,
              right: chartMargin,
              left: chartMargin + leftAxisOffset + tickSize * 2,
              bottom: chartMargin * 2 + bottomAxisOffset + symbolSize
            }}
            axisBottom={{
              tickSize,
              tickPadding: tickSize,
              legend: 'round',
              legendOffset: bottomAxisOffset,
              legendPosition: 'center'
            }}
            axisLeft={{
              tickSize,
              tickPadding: tickSize,
              legend: 'count',
              legendOffset: -leftAxisOffset,
              legendPosition: 'center'
            }}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                translateY: chartMargin + bottomAxisOffset + symbolSize,
                itemWidth: 100,
                itemHeight: symbolSize,
                symbolSize,
                symbolShape: 'circle'
              }
            ]}
          />
        </PrimaryChart>
        <SecondaryChart>
          <PieContainer>
            <ResponsivePie
              colors={COLORS}
              data={pieData}
              margin={{
                top: chartMargin,
                right: chartMargin,
                left: chartMargin,
                bottom: chartMargin
              }}
              innerRadius={0.5}
              padAngle={0.7}
              enableRadialLabels={false}
            />
          </PieContainer>
          <Filters>
            <FormControl>
              <FormLabel>Result</FormLabel>
              <RadioGroup
                name="result"
                value={this.state.result}
                onChange={this.onRadioChange}
              >
                <RadioLabel value="both" />
                <RadioLabel value="make" />
                <RadioLabel value="miss" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Posture</FormLabel>
              <RadioGroup
                name="posture"
                value={this.state.posture}
                onChange={this.onRadioChange}
              >
                <RadioLabel value="both" />
                <RadioLabel value="offense" />
                <RadioLabel value="defense" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Stance</FormLabel>
              <RadioGroup
                name="stance"
                value={this.state.stance}
                onChange={this.onRadioChange}
              >
                <RadioLabel value="both" />
                {STANCES.map(stance => (
                  <RadioLabel value={stance} key={stance} />
                ))}
              </RadioGroup>
            </FormControl>
          </Filters>
        </SecondaryChart>
      </Fragment>
    );
  }
}

export default EventCharts;
