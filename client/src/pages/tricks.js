import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import styled from 'react-emotion';
import {ResponsivePie} from '@nivo/pie';
import {connect} from 'react-redux';

const Container = styled.div({
  flexGrow: 1,
  height: 0
});

const title = 'Trick distribution';
const Tricks = props => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Header loading={props.loading}>{title}</Header>
    <Container>
      <ResponsivePie
        data={[
          {
            id: 'ruby',
            label: 'ruby',
            value: 105,
            color: 'hsl(70, 70%, 50%)'
          },
          {
            id: 'make',
            label: 'make',
            value: 203,
            color: 'hsl(221, 70%, 50%)'
          },
          {
            id: 'rust',
            label: 'rust',
            value: 270,
            color: 'hsl(152, 70%, 50%)'
          },
          {
            id: 'stylus',
            label: 'stylus',
            value: 148,
            color: 'hsl(290, 70%, 50%)'
          },
          {
            id: 'python',
            label: 'python',
            value: 467,
            color: 'hsl(23, 70%, 50%)'
          }
        ]}
        margin={{
          top: 40,
          right: 80,
          bottom: 80,
          left: 80
        }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors="nivo"
        colorBy="id"
        borderWidth={1}
        borderColor="inherit:darker(0.2)"
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor="inherit"
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        motionStiffness={90}
        motionDamping={15}
        theme={{
          tooltip: {
            container: {
              fontSize: '13px'
            }
          },
          labels: {
            textColor: '#555'
          }
        }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            size: 4,
            padding: 1,
            stagger: true
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: 'rgba(255, 255, 255, 0.3)',
            rotation: -45,
            lineWidth: 6,
            spacing: 10
          }
        ]}
        fill={[
          {
            match: {
              id: 'ruby'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'c'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'go'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'python'
            },
            id: 'dots'
          },
          {
            match: {
              id: 'scala'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'lisp'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'elixir'
            },
            id: 'lines'
          },
          {
            match: {
              id: 'javascript'
            },
            id: 'lines'
          }
        ]}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            translateY: 56,
            itemWidth: 100,
            itemHeight: 18,
            symbolSize: 18,
            symbolShape: 'circle'
          }
        ]}
      />
    </Container>
  </Fragment>
);

Tricks.propTypes = {
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.games.loading
});

export default connect(mapStateToProps)(Tricks);
