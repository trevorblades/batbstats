import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import GitHubLogo from 'react-icons/lib/fa/github';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuItem from './menu-item';
import React from 'react';
import TwitterLogo from 'react-icons/lib/fa/twitter';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import theme from '../../theme';
import withProps from 'recompose/withProps';

const {primary} = theme.palette;
const gradient = [primary[500], primary[900]].toString();
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: 250,
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(to bottom right, ${gradient})`,
  overflow: 'auto'
});

const LinkIconButton = withProps({
  color: 'inherit',
  component: 'a',
  target: '_blank',
  rel: 'noopener noreferrer'
})(IconButton);

const Sidebar = () => (
  <Container>
    <DialogTitle disableTypography>
      <Typography variant="display1" color="inherit">
        {TITLE} ⚡️
      </Typography>
      <Typography variant="body2" color="inherit">
        by Trevor Blades
      </Typography>
    </DialogTitle>
    <List>
      <MenuItem to="/">About</MenuItem>
      <MenuItem to="/skaters">Skaters</MenuItem>
      <MenuItem to="/tricks">Trick distribution</MenuItem>
    </List>
    <DialogActions style={{marginTop: 'auto'}}>
      <LinkIconButton href="https://twitter.com/trevorblades">
        <TwitterLogo />
      </LinkIconButton>
      <LinkIconButton href="https://github.com/trevorblades/batbstats">
        <GitHubLogo />
      </LinkIconButton>
    </DialogActions>
  </Container>
);

export default Sidebar;
