import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import withProps from 'recompose/withProps';

const LoadingSnackbar = withProps({
  message: 'Loading data...',
  action: <CircularProgress color="inherit" size={24} />,
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  }
})(Snackbar);

export default LoadingSnackbar;
