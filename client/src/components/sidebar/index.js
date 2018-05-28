import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import withProps from 'recompose/withProps';
import {size} from 'polished';
import Logo from '../../assets/logo.svg';
import theme from '../../theme';
import MenuItem from './menu-item';

const flexAlignCenter = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const Container = styled.div(flexAlignCenter, {
  width: 250,
  padding: theme.spacing.unit * 3,
  color: theme.palette.grey[500],
  backgroundColor: theme.palette.grey[50],
  overflow: 'auto'
});

const Content = styled.div({
  margin: 'auto'
});

const Menu = styled.nav(flexAlignCenter, {
  marginTop: theme.spacing.unit * 2
});

const Colophon = withProps({
  color: 'inherit',
  variant: 'caption'
})(
  styled(Typography)({
    marginTop: 'auto'
  })
);

const Sidebar = () => (
  <Container>
    <Content>
      <Logo {...size(100)} fill="currentColor" />
      <Menu>
        <MenuItem exact to="/">
          Dashboard
        </MenuItem>
        <MenuItem to="/skaters">Skaters</MenuItem>
      </Menu>
    </Content>
    <Colophon>© Trevor Blades</Colophon>
  </Container>
);

export default Sidebar;
