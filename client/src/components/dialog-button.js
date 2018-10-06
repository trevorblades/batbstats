import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';

class DialogButton extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    title: PropTypes.node.isRequired
  };

  state = {
    open: false
  };

  open = () => this.setState({open: true}, this.props.onOpened);

  onClose = () => this.setState({open: false});

  render() {
    const {title, children, ...props} = this.props;
    return (
      <Fragment>
        <Button {...props} onClick={this.open}>
          {title}
        </Button>
        <Dialog fullWidth open={this.state.open} onClose={this.onClose}>
          {children(this.onClose)}
        </Dialog>
      </Fragment>
    );
  }
}

export default DialogButton;
