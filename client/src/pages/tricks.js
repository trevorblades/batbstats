import GamesLoader from '../components/games-loader';
import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from 'react-emotion';
import theme from '../theme';
import withProps from 'recompose/withProps';
import {ResponsivePie} from '@nivo/pie';
import {connect} from 'react-redux';
import {getFlips, getVariations, getSpins} from '../selectors';

const Container = styled.div({
  display: 'flex',
  flexGrow: 1,
  svg: {
    display: 'block'
  }
});

const MainChart = styled.div({
  width: '66.666%'
});

const OtherCharts = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden'
});

const Cell = styled.div({
  height: '50%'
});

const margin = theme.spacing.unit * 5;
const symbolSize = 18;
const Pie = withProps({
  margin: {
    top: margin,
    right: margin,
    left: margin,
    bottom: margin * 2 + symbolSize
  },
  innerRadius: 0.5,
  padAngle: 0.7,
  colors: 'paired',
  enableRadialLabels: false,
  legends: [
    {
      anchor: 'bottom',
      direction: 'row',
      translateY: margin + symbolSize,
      itemWidth: 100,
      itemHeight: symbolSize,
      symbolSize,
      symbolShape: 'circle'
    }
  ]
})(ResponsivePie);

const title = 'Trick distribution';
class Tricks extends Component {
  static propTypes = {
    flips: PropTypes.array.isRequired,
    spins: PropTypes.array.isRequired,
    variations: PropTypes.array.isRequired
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header>{title}</Header>
          <Container>
            <MainChart>
              <Pie data={this.props.variations} />
            </MainChart>
            <OtherCharts>
              <Cell>
                <Pie data={this.props.flips} />
              </Cell>
              <Cell>
                <Pie data={this.props.spins} />
              </Cell>
            </OtherCharts>
          </Container>
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  flips: getFlips(state),
  spins: getSpins(state),
  variations: getVariations(state)
});

export default connect(mapStateToProps)(Tricks);
