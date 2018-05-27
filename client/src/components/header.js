import AppBar from '@material-ui/core/AppBar';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const Header = () => (
  <AppBar position="static" elevation={0}>
    <Toolbar>
      <Typography color="inherit" variant="title">
        BATB Stats
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
