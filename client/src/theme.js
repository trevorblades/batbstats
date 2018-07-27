import blueGrey from '@material-ui/core/colors/blueGrey';
import indigo from '@material-ui/core/colors/indigo';
import {createMuiTheme} from '@material-ui/core/styles';

const title = {
  fontFamily: "'Helvetica Neue', Helvetica",
  fontWeight: 700
};

const defaultTheme = createMuiTheme();
const display1 = {
  ...title,
  color: defaultTheme.palette.text.primary
};

export default createMuiTheme({
  overrides: {
    MuiPickersDay: {
      day: {
        fontWeight: 400
      }
    }
  },
  palette: {
    primary: indigo,
    grey: blueGrey
  },
  typography: {
    fontFamily: "'Inconsolata', monospace",
    fontSize: 16,
    fontWeightMedium: 700,
    title,
    headline: title,
    display1,
    display2: display1,
    display3: display1
  }
});
