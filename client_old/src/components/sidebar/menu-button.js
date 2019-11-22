import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import LoginForm from '../login-form';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import styled from 'react-emotion';
import {withUser} from '../../util/user-context';

const StyledIconButton = styled(IconButton)({
  marginLeft: 'auto'
});

class MenuButton extends Component {
  static propTypes = {
    setToken: PropTypes.func.isRequired,
    token: PropTypes.string
  };

  state = {
    anchorEl: null,
    dialogOpen: false
  };

  componentDidUpdate(prevProps) {
    if (this.props.token && !prevProps.token) {
      this.setState({dialogOpen: false});
    }
  }

  onClick = event => this.setState({anchorEl: event.currentTarget});

  onLogInClick = () =>
    this.setState({
      anchorEl: null,
      dialogOpen: true
    });

  logOut = () => this.props.setToken(null);

  closeMenu = () => this.setState({anchorEl: null});

  closeDialog = () => this.setState({dialogOpen: false});

  render() {
    return (
      <Fragment>
        <StyledIconButton color="primary" onClick={this.onClick}>
          <MoreHorizIcon />
        </StyledIconButton>
        <Menu
          disableRestoreFocus
          open={Boolean(this.state.anchorEl)}
          anchorEl={this.state.anchorEl}
          onClose={this.closeMenu}
        >
          {this.props.token ? (
            <MenuItem onClick={this.logOut}>Log out</MenuItem>
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

export default withUser(MenuButton);
