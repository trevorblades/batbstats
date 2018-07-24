import teal from '@material-ui/core/colors/teal';
import blueGrey from '@material-ui/core/colors/blueGrey';
import indigo from '@material-ui/core/colors/indigo';
import {createMuiTheme} from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    primary: indigo,
    secondary: teal,
    grey: blueGrey
  },
  typography: {
    fontFamily: '"Helvetica Neue", Helvetica',
    title: {
      fontWeight: 700
    }
  }
});
