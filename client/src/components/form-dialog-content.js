import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import isEqual from 'lodash/isEqual';
import {connect} from 'react-redux';

class FormDialogContent extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    data: PropTypes.object.isRequired,
    form: PropTypes.func.isRequired,
    isEqual: PropTypes.func,
    user: PropTypes.object
  };

  static defaultProps = {
    isEqual
  };

  state = {
    editing: false
  };

  componentDidUpdate(prevProps) {
    if (
      this.state.editing &&
      !this.props.isEqual(this.props.data, prevProps.data)
    ) {
      this.stopEditing();
    }
  }

  onEditClick = () => this.setState({editing: true});

  stopEditing = () => this.setState({editing: false});

  render() {
    if (this.state.editing) {
      return React.createElement(this.props.form, {
        data: this.props.data,
        onCancel: this.stopEditing
      });
    }

    return (
      <Fragment>
        {this.props.children}
        {this.props.user && (
          <DialogActions>
            <Button onClick={this.onEditClick}>Edit</Button>
          </DialogActions>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

export default connect(mapStateToProps)(FormDialogContent);
