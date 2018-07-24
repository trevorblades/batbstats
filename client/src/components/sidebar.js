import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';
import theme from '../theme';

const {primary} = theme.palette;
const gradient = [primary[500], primary[900]].toString();
const Container = styled.div({
  flexShrink: 0,
  width: 250,
  padding: theme.spacing.unit * 2.5,
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(to bottom right, ${gradient})`,
  overflow: 'auto'
});

const Sidebar = () => (
  <Container>
    <Typography variant="display1" color="inherit">
      {TITLE}
    </Typography>
    <Typography variant="subheading" color="inherit">
      by Trevor Blades
    </Typography>
  </Container>
);

export default Sidebar;
