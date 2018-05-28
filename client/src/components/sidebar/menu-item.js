import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import {NavLink} from 'react-router-dom';
import theme from '../../theme';

const StyledLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'inherit',
  ':not(:last-child)': {
    marginBottom: theme.spacing.unit
  },
  '&.active': {
    color: theme.palette.grey[900]
  },
  ':not(.active):hover': {
    color: theme.palette.grey[700]
  }
});

class MenuItem extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    exact: PropTypes.bool,
    to: PropTypes.string.isRequired
  };

  render() {
    return (
      <StyledLink exact={this.props.exact} to={this.props.to}>
        <Typography color="inherit" variant="body2">
          {this.props.children}
        </Typography>
      </StyledLink>
    );
  }
}

export default MenuItem;
