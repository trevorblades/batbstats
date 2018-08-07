import theme from '@trevorblades/mui-theme';
import {injectGlobal} from 'emotion';

export default () =>
  injectGlobal({
    [['html', 'body', '#root']]: {
      height: '100%'
    },
    body: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary
    }
  });
