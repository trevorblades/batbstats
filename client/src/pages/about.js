import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {StyledDialogContent} from '../components';

const About = () => (
  <Fragment>
    <DialogTitle disableTypography>
      <Typography variant="h3">BATB Stats</Typography>
    </DialogTitle>
    <StyledDialogContent>
      <Grid container>
        <Grid item sm={12} md={8}>
          <Typography paragraph>
            This is a collection of charts and data visualizations about{' '}
            <a
              href="https://en.wikipedia.org/wiki/Game_of_Skate"
              target="_blank"
              rel="noopener noreferrer"
            >
              games of S.K.A.T.E.
            </a>{' '}
            played in the contest series, <em>Battle at the Berrics</em>.
          </Typography>
        </Grid>
      </Grid>
    </StyledDialogContent>
  </Fragment>
);

export default About;
