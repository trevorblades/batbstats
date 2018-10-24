import AppBar from '@material-ui/core/AppBar';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
});

const Header = props => (
  <AppBar elevation={0} position="sticky" color="inherit">
    <StyledDialogTitle className={props.className} disableTypography>
      {props.children}
    </StyledDialogTitle>
    {props.withDivider && <Divider />}
  </AppBar>
);

Header.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  withDivider: PropTypes.bool
};

export default Header;
