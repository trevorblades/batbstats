import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import fromPairs from 'lodash/fromPairs';
import {connect} from 'react-redux';
import {getFormId} from '../util/form';
import {submit as submitForm} from '../actions/form';

class Form extends Component {
  static propTypes = {
    action: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    method: PropTypes.string.isRequired,
    onCancel: PropTypes.func,
    render: PropTypes.func.isRequired,
    successActionCreator: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
  };

  onSubmit = event => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const entries = Array.from(formData.entries());
    this.props.dispatch(
      submitForm({
        body: fromPairs(entries),
        method: this.props.method,
        action: this.props.action,
        successActionCreator: this.props.successActionCreator
      })
    );
  };

  render() {
    const {errors} = this.props.error || {};
    return (
      <form onSubmit={this.onSubmit}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>{this.props.render(errors)}</DialogContent>
        <DialogActions>
          {this.props.onCancel && (
            <Button onClick={this.props.onCancel}>Cancel</Button>
          )}
          <Button color="primary" type="submit" disabled={this.props.loading}>
            Save
          </Button>
        </DialogActions>
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const formId = getFormId(ownProps.method, ownProps.action);
  const form = state.form[formId];
  return {
    error: form && form.error,
    loading: Boolean(form && form.loading)
  };
};

export default connect(mapStateToProps)(Form);
