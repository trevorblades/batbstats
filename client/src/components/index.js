import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import styled from 'react-emotion';
import withProps from 'recompose/withProps';

export const formFieldProps = {
  margin: 'dense',
  fullWidth: true
};

export const FormFieldControl = withProps(formFieldProps)(FormControl);
export const FormField = withProps(formFieldProps)(TextField);

export const StyledDialogContent = styled(DialogContent)({
  overflowY: 'visible'
});

export const CenteredCircularProgress = styled(CircularProgress)({
  margin: 'auto'
});
