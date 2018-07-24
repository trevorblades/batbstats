import List from '@material-ui/core/List';
import MenuItem from './menu-item';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import theme from '../../theme';

const {primary} = theme.palette;
const gradient = [primary[500], primary[900]].toString();
const Container = styled.div({
  flexShrink: 0,
  width: 250,
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(to bottom right, ${gradient})`,
  overflow: 'auto'
});

const Heading = styled.div({
  padding: theme.spacing.unit * 3
});

const Sidebar = () => (
  <Container>
    <Heading>
      <Typography variant="display1" color="inherit">
        {TITLE} ⚡️
      </Typography>
      <Typography variant="body2" color="inherit">
        by Trevor Blades
      </Typography>
    </Heading>
    <List>
      <MenuItem to="/">About</MenuItem>
      <MenuItem to="/skaters">Skaters</MenuItem>
      <MenuItem to="/tricks">Trick distribution</MenuItem>
    </List>
  </Container>
);

export default Sidebar;
