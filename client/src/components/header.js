import AppBar from '@material-ui/core/AppBar';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const Header = props => (
  <AppBar elevation={0} position="sticky" color="inherit">
    <StyledDialogTitle disableTypography>{props.children}</StyledDialogTitle>
  </AppBar>
);

Header.propTypes = {
  children: PropTypes.node
};

export default Header;
