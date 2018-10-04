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

  open = () => this.setState({open: true});

  close = () => this.setState({open: false});

  render() {
    return (
      <Fragment>
        <Button variant="outlined" onClick={this.open}>
          {this.props.title}
        </Button>
        <Dialog open={this.state.open} onClose={this.close}>
          {this.props.children(this.close)}
        </Dialog>
      </Fragment>
    );
  }
}

export default DialogButton;
