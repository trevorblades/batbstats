import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import {Link} from 'react-router-dom';

const NavItem = props => (
  <ListItem button component={Link} to={props.to}>
    <ListItemText
      primary={props.children}
      primaryTypographyProps={{color: 'inherit'}}
    />
  </ListItem>
);

NavItem.propTypes = {
  children: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired
};

export default NavItem;
