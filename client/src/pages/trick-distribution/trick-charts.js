import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import React, {Component} from 'react';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import upperFirst from 'lodash/upperFirst';
import withProps from 'recompose/withProps';
import {STANCES} from '../../../../api/common';
import {ResponsiveLine} from '@nivo/line';
import {ResponsivePie} from '@nivo/pie';
import {connect} from 'react-redux';
import {setResult, setStance, setPosture} from '../../actions/settings';
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

const symbolSize = 12;
const tickSize = 5;
const leftAxisOffset = -40;
const bottomAxisOffset = 36;
const margin = theme.spacing.unit * 4;
const Line = withProps({
  margin: {
    top: margin,
    right: margin,
    left: margin - leftAxisOffset + tickSize * 2,
    bottom: margin * 2 + bottomAxisOffset + symbolSize
  },
  axisBottom: {
    tickSize,
    tickPadding: tickSize,
    legend: 'event',
    legendOffset: 36,
    legendPosition: 'center'
  },
  axisLeft: {
    tickSize,
    tickPadding: tickSize,
    legend: 'count',
    legendOffset: -40,
    legendPosition: 'center'
  },
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      translateY: margin + bottomAxisOffset + symbolSize,
      itemWidth: 100,
      itemHeight: symbolSize,
      symbolSize,
      symbolShape: 'circle'
    }
  ]
})(ResponsiveLine);

const Pie = withProps({
  margin: {
    top: margin,
    right: margin,
    left: margin,
    bottom: margin
  },
  innerRadius: 0.5,
  padAngle: 0.7,
  enableRadialLabels: false
})(ResponsivePie);

const Primary = styled.div({
  flexGrow: 1,
  height: 0,
  minHeight: 350
});

const Secondary = styled.div({
  display: 'flex',
  flexShrink: 0,
  backgroundColor: theme.palette.background.default
});

const PieContainer = styled.div(size(250));
const Filters = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  flexGrow: 1,
  padding: margin,
  paddingLeft: 0
});

const RadioLabel = withProps({control: <Radio />})(FormControlLabel);

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
        <Primary>
          <Line data={this.props.lineData} />
        </Primary>
        <Secondary>
          <PieContainer>
            <Pie data={this.props.pieData} />
          </PieContainer>
          <Filters>
            <FormControl>
              <FormLabel>Result</FormLabel>
              <RadioGroup
                value={this.props.result}
                onChange={this.onResultChange}
              >
                <RadioLabel value="both" label="Both" />
                <RadioLabel value="make" label="Make" />
                <RadioLabel value="miss" label="Miss" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Posture</FormLabel>
              <RadioGroup
                value={this.props.posture}
                onChange={this.onPostureChange}
              >
                <RadioLabel value="both" label="Both" />
                <RadioLabel value="offense" label="Offense" />
                <RadioLabel value="defense" label="Defense" />
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Stance</FormLabel>
              <RadioGroup
                value={this.props.stance}
                onChange={this.onStanceChange}
              >
                <RadioLabel value="both" label="Both" />
                {STANCES.map(stance => (
                  <RadioLabel
                    value={stance}
                    key={stance}
                    label={upperFirst(stance)}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Filters>
        </Secondary>
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
