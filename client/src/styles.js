import theme from '@trevorblades/mui-theme';
import {css, injectGlobal} from 'react-emotion';
import {size} from 'polished';

export default () =>
  injectGlobal({
    [['html', 'body', '#root']]: {
      height: '100%'
    },
    body: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.text.primary
    },
    'img.emoji': css(size('1.25em'), {
      marginLeft: '0.1em',
      marginRight: '0.05em',
      verticalAlign: '-0.25em'
    })
  });
