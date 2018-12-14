import Avatar from '@material-ui/core/Avatar';
import Header from '../components/header';
import Helmet from 'react-helmet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import {CenteredCircularProgress} from '../components';
import {Link} from 'react-router-dom';
import {Query} from 'react-apollo';

const title = 'Events';
const query = gql`
  {
    events {
      id
      name
      image
    }
  }
`;

const Events = () => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Query query={query}>
      {({loading, error, data}) => {
        if (loading) return <CenteredCircularProgress />;
        if (error) return <div>{error.message}</div>;
        return (
          <Fragment>
            <Header>
              <Typography variant="h3">{title}</Typography>
            </Header>
            <List>
              {data.events.map(event => (
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
        );
      }}
    </Query>
  </Fragment>
);

export default Events;
