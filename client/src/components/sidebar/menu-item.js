import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import withProps from 'recompose/withProps';
import {Link} from 'react-router-dom';

const ListItemLink = withProps({
  button: true,
  component: Link
})(ListItem);

const MenuItem = props => (
  <ListItemLink to={props.to}>
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{color: 'inherit'}}
    />
  </ListItemLink>
);

MenuItem.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default MenuItem;
