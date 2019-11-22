import Layout from '../components/layout';
import PropTypes from 'prop-types';
import React from 'react';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import {Helmet} from 'react-helmet';
import {Link, graphql} from 'gatsby';

export default function Index(props) {
  return (
    <Layout>
      <Helmet>
        <title>Events</title>
      </Helmet>
      <List>
        {props.data.batbstats.events.map(event => (
          <ListItem
            disableGutters
            key={event.id}
            button
            component={Link}
            to={`/events/${event.id}`}
          >
            <ListItemAvatar>
              <Avatar src={event.image} />
            </ListItemAvatar>
            <ListItemText>{event.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Layout>
  );
}

Index.propTypes = {
  data: PropTypes.object.isRequired
};

export const pageQuery = graphql`
  {
    batbstats {
      events {
        id
        name
        image
      }
    }
  }
`;
