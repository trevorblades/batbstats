import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, {Component} from 'react';
import mapProps from 'recompose/mapProps';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import upperFirst from 'lodash/upperFirst';
import {ResponsiveLine} from '@nivo/line';
import {ResponsivePie} from '@nivo/pie';
import {STANCES} from '../../../../api/common';
import {connect} from 'react-redux';
import {setPosture, setResult, setStance} from '../../actions/settings';
import {size} from 'polished';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  height: 0,
  svg: {
    display: 'block'
  }
});

const PrimaryChart = styled.div({
  flexGrow: 1,
  height: 0,
  minHeight: 350
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

const PieContainer = styled.div(size(250));
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
class TrickCharts extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    lineData: PropTypes.array.isRequired,
    pieData: PropTypes.array.isRequired,
    posture: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired,
    stance: PropTypes.string.isRequired
  };

  onResultChange = event => this.props.dispatch(setResult(event.target.value));

  onStanceChange = event => this.props.dispatch(setStance(event.target.value));

  onPostureChange = event =>
    this.props.dispatch(setPosture(event.target.value));

  render() {
    return (
      <Container>
        <PrimaryChart>
          <ResponsiveLine
            colors={COLORS}
            data={this.props.lineData}
            margin={{
              top: chartMargin,
              right: chartMargin,
              left: chartMargin + leftAxisOffset + tickSize * 2,
              bottom: chartMargin * 2 + bottomAxisOffset + symbolSize
            }}
            axisBottom={{
              tickSize,
              tickPadding: tickSize,
              legend: 'event',
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
              data={this.props.pieData}
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
                value={this.props.result}
                onChange={this.onResultChange}
              >
                <RadioLabel value="both" />
                <RadioLabel value="make" />
                <RadioLabel value="miss" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Posture</FormLabel>
              <RadioGroup
                value={this.props.posture}
                onChange={this.onPostureChange}
              >
                <RadioLabel value="both" />
                <RadioLabel value="offense" />
                <RadioLabel value="defense" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Stance</FormLabel>
              <RadioGroup
                value={this.props.stance}
                onChange={this.onStanceChange}
              >
                <RadioLabel value="both" />
                {STANCES.map(stance => (
                  <RadioLabel value={stance} key={stance} />
                ))}
              </RadioGroup>
            </FormControl>
          </Filters>
        </SecondaryChart>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  result: state.settings.result,
  stance: state.settings.stance,
  posture: state.settings.posture
});

export default connect(mapStateToProps)(TrickCharts);
