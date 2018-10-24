import Header from '../../components/header';
import Helmet from 'react-helmet';
import React, {Fragment} from 'react';
import TricksTable from './tricks-table';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import {CenteredCircularProgress, StyledDialogContent} from '../../components';
import {Query} from 'react-apollo';

const title = 'Tricks';
const query = gql`
  {
    tricks {
      id
      name
      attempts {
        offense
        successful
      }
    }
  }
`;

const Tricks = () => (
  <Fragment>
    <Helmet>
      <title>{title}</title>
    </Helmet>
    <Query query={query}>
      {({loading, error, data}) => {
        if (loading) return <CenteredCircularProgress />;
        if (error) return null;
        return (
          <Fragment>
            <Header>
              <Typography variant="h3">{title}</Typography>
            </Header>
            <StyledDialogContent>
              <TricksTable tricks={data.tricks} />
            </StyledDialogContent>
          </Fragment>
        );
      }}
    </Query>
  </Fragment>
);

export default Tricks;
