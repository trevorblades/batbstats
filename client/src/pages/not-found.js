import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'react-emotion';

const Container = styled.div({
  margin: 'auto',
  textAlign: 'center'
});

const NotFound = () => (
  <Container>
    <Typography gutterBottom variant="display1">
      Page not found
    </Typography>
    <Typography variant="subheading">That&apos;s a bummer 😓</Typography>
  </Container>
);

export default NotFound;
