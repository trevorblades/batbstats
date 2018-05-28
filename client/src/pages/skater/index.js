import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import {connect} from 'react-redux';
import {load as loadSkater} from '../../actions/skater';
import NotFound from '../not-found';
import Games from './games';
import Header from './header';
import Tricks from './tricks';

class Skater extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    skater: PropTypes.object
  };

  state = {
    tabIndex: 0
  };

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.load();
    }
  }

  onTabChange = (event, value) => this.setState({tabIndex: value});

  load = () => this.props.dispatch(loadSkater(this.props.match.params.id));

  render() {
    if (!this.props.skater) {
      if (this.props.loading) {
        return <CircularProgress />;
      }
      return <NotFound />;
    }

    return (
      <Fragment>
        <Header />
        <Tabs centered value={this.state.tabIndex} onChange={this.onTabChange}>
          <Tab label="Tricks" />
          <Tab label="Games" />
          <Tab label="Roshambo" />
        </Tabs>
        <Divider />
        {this.state.tabIndex === 0 && <Tricks />}
        {this.state.tabIndex === 1 && <Games />}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.skater.loading,
  skater: state.skater.properties
});

export default connect(mapStateToProps)(Skater);
