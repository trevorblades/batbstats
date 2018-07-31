import TextField from '@material-ui/core/TextField';
import mapProps from 'recompose/mapProps';

export const formFieldProps = {
  margin: 'dense',
  fullWidth: true
};

const FormField = mapProps(props => {
  const error = props.errors && props.errors[props.name];
  return {
    ...props,
    ...formFieldProps,
    error: Boolean(error),
    helperText: error && error.msg
  };
})(TextField);

export default FormField;
