import DialogTitle from '@material-ui/core/DialogTitle';
import Helmet from 'react-helmet';
import React, {Fragment} from 'react';
import Typography from '@material-ui/core/Typography';
import {StyledDialogContent} from '../components';

const About = () => (
  <Fragment>
    <Helmet>
      <title>About</title>
    </Helmet>
    <DialogTitle disableTypography>
      <Typography variant="h3">About the project</Typography>
    </DialogTitle>
    <StyledDialogContent>
      <Typography paragraph>
        BATB Stats is a collection of charts and data visualizations about{' '}
        <a
          href="https://en.wikipedia.org/wiki/Game_of_Skate"
          target="_blank"
          rel="noopener noreferrer"
        >
          games of S.K.A.T.E.
        </a>{' '}
        played in the contest series, <em>Battle at the Berrics</em>.
      </Typography>
    </StyledDialogContent>
  </Fragment>
);

export default About;
