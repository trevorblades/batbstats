import theme from './theme';
import {injectGlobal} from 'emotion';

injectGlobal({
  [['html', 'body', '#root']]: {
    height: '100%'
  },
  body: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary
  }
});
