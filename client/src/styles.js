import {injectGlobal} from 'emotion';

export default () => {
  injectGlobal({
    [['html', 'body', '#root']]: {
      height: '100%'
    }
  });
};
