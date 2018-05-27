import {injectGlobal} from 'emotion';
import {normalize} from 'polished';

export default () => {
  injectGlobal(normalize(), {
    [['html', 'body', '#root']]: {
      height: '100%'
    }
  });
};
