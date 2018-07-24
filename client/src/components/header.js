import AppBar from '@material-ui/core/AppBar';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

const Header = props => (
  <AppBar elevation={0} position="sticky" color="inherit">
    <DialogTitle>{props.children}</DialogTitle>
    <LinearProgress
      color="primary"
      variant={props.loading ? 'indeterminate' : 'determinate'}
      value={100}
      style={{height: 2}}
    />
  </AppBar>
);

Header.propTypes = {
  children: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.games.loading
});

export default connect(mapStateToProps)(Header);
