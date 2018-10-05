import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import GridItem from './grid-item';
import Header from '../../components/header';
import NotFound from '../not-found';
import PropTypes from 'prop-types';
import React, {Fragment} from 'react';
import TrickForm from './trick-form';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import upperFirst from 'lodash/upperFirst';
import {CenteredCircularProgress, StyledDialogContent} from '../../components';
import {Query} from 'react-apollo';
import {connect} from 'react-redux';

const query = gql`
  query Trick($id: ID) {
    trick(id: $id) {
      id
      name
      flip
      shuv
      spin
      variation
      other
      attempts {
        id
      }
    }
  }
`;

const Trick = props => (
  <Query query={query} variables={{id: props.match.params.id}}>
    {({loading, error, data}) => {
      if (loading) return <CenteredCircularProgress />;
      if (error) return <NotFound />;
      return (
        <Fragment>
          <Header>
            <Typography variant="display1">{data.trick.name}</Typography>
            {props.user && <TrickForm trick={data.trick} />}
          </Header>
          <StyledDialogContent>
            <Grid container>
              <GridItem>
                <DialogContentText>Flip: {data.trick.flip}</DialogContentText>
              </GridItem>
              <GridItem>
                <DialogContentText>Shuv: {data.trick.shuv}</DialogContentText>
              </GridItem>
              <GridItem>
                <DialogContentText>Spin: {data.trick.spin}</DialogContentText>
              </GridItem>
              <GridItem>
                <DialogContentText>
                  Variation:{' '}
                  {data.trick.variation
                    ? upperFirst(data.trick.variation)
                    : 'None'}
                </DialogContentText>
              </GridItem>
              <GridItem>
                <DialogContentText>
                  Attempts: {data.trick.attempts.length}
                </DialogContentText>
              </GridItem>
              <GridItem>
                <DialogContentText>
                  Other: {Boolean(data.trick.other).toString()}
                </DialogContentText>
              </GridItem>
            </Grid>
          </StyledDialogContent>
        </Fragment>
      );
    }}
  </Query>
);

Trick.propTypes = {
  match: PropTypes.object.isRequired,
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user.data
});

export default connect(mapStateToProps)(Trick);
