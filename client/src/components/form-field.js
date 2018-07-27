import TextField from '@material-ui/core/TextField';
import withProps from 'recompose/withProps';

export const formFieldProps = {
  margin: 'dense',
  fullWidth: true
};

export default withProps(formFieldProps)(TextField);
