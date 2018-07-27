import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import LoginForm from '../login-form';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {logOut} from '../../actions/user';

const StyledIconButton = styled(IconButton)({
  marginLeft: 'auto'
});

class MenuButton extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object
  };

  state = {
    anchorEl: null,
    dialogOpen: false
  };

  componentDidUpdate(prevProps) {
    if (this.props.user && !prevProps.user) {
      this.setState({dialogOpen: false});
    }
  }

  onClick = event => this.setState({anchorEl: event.currentTarget});

  onLogInClick = () =>
    this.setState({
      anchorEl: null,
      dialogOpen: true
    });

  onLogOutClick = () => this.props.dispatch(logOut());

  closeMenu = () => this.setState({anchorEl: null});

  closeDialog = () => this.setState({dialogOpen: false});

  render() {
    return (
      <Fragment>
        <StyledIconButton color="primary" onClick={this.onClick}>
          <MoreHorizIcon />
        </StyledIconButton>
        <Menu
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.closeMenu}
        >
          {this.props.user ? (
            <MenuItem onClick={this.onLogOutClick}>Log out</MenuItem>
          ) : (
            <MenuItem onClick={this.onLogInClick}>Log in</MenuItem>
          )}
        </Menu>
        <Dialog
          fullWidth
          open={this.state.dialogOpen}
          onClose={this.closeDialog}
        >
          <LoginForm />
        </Dialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data
});

export default connect(mapStateToProps)(MenuButton);
