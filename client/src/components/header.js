import AppBar from '@material-ui/core/AppBar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'react-emotion';

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center'
});

const Header = props => (
  <AppBar elevation={0} position="sticky" color="inherit">
    <StyledDialogTitle disableTypography>
      <Typography variant="headline">{props.title}</Typography>
      {props.children}
    </StyledDialogTitle>
    <Divider />
  </AppBar>
);

Header.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired
};

export default Header;
