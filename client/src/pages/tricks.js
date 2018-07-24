import EmptyStateProvider from '../components/empty-state-provider';
import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from 'react-emotion';
import theme from '../theme';
import withProps from 'recompose/withProps';
import {ResponsivePie} from '@nivo/pie';
import {connect} from 'react-redux';
import {getTrickTypes} from '../selectors';

const Container = styled.div({
  flexGrow: 1,
  height: 0,
  svg: {
    display: 'block'
  }
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
  radialLabelsLinkColor: 'inherit',
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
    loading: PropTypes.bool.isRequired,
    trickTypes: PropTypes.array.isRequired
  };

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <EmptyStateProvider>
          <Header loading={this.props.loading}>{title}</Header>
          <Container>
            <Pie data={this.props.trickTypes} />
          </Container>
        </EmptyStateProvider>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.games.loading,
  trickTypes: getTrickTypes(state)
});

export default connect(mapStateToProps)(Tricks);
