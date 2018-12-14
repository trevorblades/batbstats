import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import GitHubLogo from 'react-icons/lib/fa/github';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuButton from './menu-button';
import NavItem from './nav-item';
import React from 'react';
import Twemoji from 'react-twemoji';
import TwitterLogo from 'react-icons/lib/fa/twitter';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import theme, {getLinearGradient} from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';

const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: 250,
  color: theme.palette.common.white,
  backgroundImage: getLinearGradient('to bottom right'),
  overflow: 'auto'
});

const StyledDialogActions = styled(DialogActions)({
  marginTop: 'auto'
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
      <Typography variant="h4" title="BATB Stats">
        <Twemoji>{FAVICON}</Twemoji>
      </Typography>
    </DialogTitle>
    <nav>
      <List>
        <NavItem to="/">About</NavItem>
        <NavItem to="/events">Events</NavItem>
        <NavItem to="/skaters">Skaters</NavItem>
        <NavItem to="/tricks">Tricks</NavItem>
      </List>
    </nav>
    <StyledDialogActions>
      <LinkIconButton href="https://github.com/trevorblades/batbstats/client">
        <GitHubLogo />
      </LinkIconButton>
      <LinkIconButton href="https://twitter.com/trevorblades">
        <TwitterLogo />
      </LinkIconButton>
      <MenuButton />
    </StyledDialogActions>
  </Container>
);

export default Sidebar;
