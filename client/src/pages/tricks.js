import GamesLoader from '../components/games-loader';
import Header from '../components/header';
import Helmet from 'react-helmet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
      <List>
        {props.tricks.map(trick => (
          <ListItem key={trick.id}>
            <ListItemText primary={trick.name} />
          </ListItem>
        ))}
      </List>
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
