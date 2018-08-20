import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import MenuItem from '@material-ui/core/MenuItem';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Select from '@material-ui/core/Select';
import TrickCharts from './trick-charts';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';
import {Link, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {
  getFlipsLineData,
  getFlipsPieData,
  getSpinsLineData,
  getSpinsPieData,
  getVariationsLineData,
  getVariationsPieData
} from '../../selectors';

const Variations = connect(state => ({
  lineData: getVariationsLineData(state),
  pieData: getVariationsPieData(state)
}))(TrickCharts);

const Flips = connect(state => ({
  lineData: getFlipsLineData(state),
  pieData: getFlipsPieData(state)
}))(TrickCharts);

const Spins = connect(state => ({
  lineData: getSpinsLineData(state),
  pieData: getSpinsPieData(state)
}))(TrickCharts);

const StyledSelect = styled(Select)({marginLeft: 'auto'});
const MenuLink = withProps({component: Link})(MenuItem);

const title = 'Trick distribution';
class TrickDistribution extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
  };

  renderMenuLink(path, text) {
    return (
      <MenuLink to={path} value={path}>
        {text}
      </MenuLink>
    );
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header title={title}>
            <StyledSelect value={this.props.location.pathname}>
              {this.renderMenuLink(this.props.match.path, 'Stance variations')}
              {this.renderMenuLink(
                `${this.props.match.path}/flips`,
                'Flip type'
              )}
              {this.renderMenuLink(
                `${this.props.match.path}/spins`,
                'Spin direction'
              )}
            </StyledSelect>
          </Header>
          <Switch>
            <Route exact path={this.props.match.path} component={Variations} />
            <Route
              exact
              path={`${this.props.match.path}/flips`}
              component={Flips}
            />
            <Route
              exact
              path={`${this.props.match.path}/spins`}
              component={Spins}
            />
            <Route component={NotFound} />
          </Switch>
        </GamesLoader>
      </Fragment>
    );
  }
}

export default TrickDistribution;