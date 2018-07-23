import MenuItem from './menu-item';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled, {css} from 'react-emotion';
import withProps from 'recompose/withProps';
import theme from '../../theme';

const flexAlignCenter = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const Container = styled.div(flexAlignCenter, {
  flexShrink: 0,
  width: 250,
  padding: theme.spacing.unit * 3,
  color: theme.palette.primary[500],
  backgroundColor: theme.palette.grey[100],
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
      <Menu>
        <MenuItem exact to="/">
          Dashboard
        </MenuItem>
      </Menu>
    </Content>
    <Colophon>© Trevor Blades</Colophon>
  </Container>
);

export default Sidebar;
