import GamesLoader from '../components/games-loader';
import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {getTricks} from '../selectors';

const title = 'Tricks';
const Tricks = props => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <GamesLoader>
      <Header>{title}</Header>
      <div>
        {props.tricks.map(trick => <div key={trick.id}>{trick.name}</div>)}
      </div>
    </GamesLoader>
  </Fragment>
);

Tricks.propTypes = {
  tricks: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  tricks: getTricks(state)
});

export default connect(mapStateToProps)(Tricks);
