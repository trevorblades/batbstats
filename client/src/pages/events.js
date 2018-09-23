import Avatar from '@material-ui/core/Avatar';
import GamesLoader from '../components/games-loader';
import Header from '../components/header';
import Helmet from 'react-helmet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {getEvents} from '../selectors';

const title = 'Events';
const Events = props => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <GamesLoader>
      <Fragment>
        <Header>
          <Typography variant="display1">{title}</Typography>
        </Header>
        <List>
          {props.events.map(event => (
            <ListItem
              button
              key={event.id}
              component={Link}
              to={`/events/${event.id}`}
            >
              <ListItemAvatar>
                <Avatar src={event.image} />
              </ListItemAvatar>
              <ListItemText primary={event.name} />
            </ListItem>
          ))}
        </List>
      </Fragment>
    </GamesLoader>
  </Fragment>
);

Events.propTypes = {
  events: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  events: getEvents(state)
});

export default connect(mapStateToProps)(Events);
