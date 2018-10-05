import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import withProps from 'recompose/withProps';

export const formFieldProps = {
  margin: 'dense',
  fullWidth: true
};

export const FormFieldControl = withProps(formFieldProps)(FormControl);
const FormField = withProps(formFieldProps)(TextField);

export default FormField;
