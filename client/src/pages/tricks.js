import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {connect} from 'react-redux';

const title = 'Trick distribution';
const Tricks = props => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Header loading={props.loading}>{title}</Header>
    <div>Coming soon...</div>
  </Fragment>
);

Tricks.propTypes = {
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.games.loading
});

export default connect(mapStateToProps)(Tricks);
