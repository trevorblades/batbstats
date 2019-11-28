import AuthRequired from '../components/auth-required';
import Header from '../components/header';
import Layout from '../components/layout';
import React from 'react';
import TricksTable from '../components/tricks-table';
import {Box, NoSsr, Typography} from '@material-ui/core';
import {Helmet} from 'react-helmet';

export default function Tricks() {
  return (
    <Layout>
      <Helmet>
        <title>Tricks</title>
      </Helmet>
      <NoSsr>
        <AuthRequired>
          <Header />
          <Box p={4}>
            <Typography gutterBottom variant="h4">
              Tricks
            </Typography>
            <TricksTable />
          </Box>
        </AuthRequired>
      </NoSsr>
    </Layout>
  );
}
