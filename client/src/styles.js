import {injectGlobal} from 'emotion';

injectGlobal({
  [['html', 'body', '#root']]: {
    height: '100%'
  }
});
