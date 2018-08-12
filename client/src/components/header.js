import AppBar from '@material-ui/core/AppBar';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';

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
    <LinearProgress
      variant={props.loading ? 'indeterminate' : 'determinate'}
      value={0}
      style={{height: 2}}
    />
  </AppBar>
);

Header.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  loading: state.games.loading
});

export default connect(mapStateToProps)(Header);
