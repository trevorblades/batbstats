import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SortableTable from '../../components/sortable-table';
import Typography from '@material-ui/core/Typography';
import filter from 'lodash/filter';
import gql from 'graphql-tag';
import reject from 'lodash/reject';
import round from 'lodash/round';
import {CenteredCircularProgress} from '../../components';
import {Query} from 'react-apollo';

function getSuccessRate(attempts) {
  const rate =
    attempts.length && filter(attempts, 'successful').length / attempts.length;
  return round(rate * 100, 2);
}

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

class Tricks extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  };

  onTrickClick = trick => this.props.history.push(`/tricks/${trick.id}`);

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Query query={query}>
          {({loading, error, data}) => {
            if (loading) return <CenteredCircularProgress />;
            if (error) return null;

            const columns = [
              {key: 'name'},
              {
                key: 'attempts.length',
                label: 'A',
                numeric: true
              },
              {
                key: 'osr',
                label: 'OSR',
                numeric: true
              },
              {
                key: 'dsr',
                label: 'DSR',
                numeric: true
              }
            ];

            const rows = data.tricks.map(trick => ({
              ...trick,
              osr: getSuccessRate(filter(trick.attempts, 'offense')),
              dsr: getSuccessRate(reject(trick.attempts, 'offense'))
            }));

            return (
              <Fragment>
                <Header>
                  <Typography variant="h3">{title}</Typography>
                </Header>
                <SortableTable
                  rows={rows}
                  onRowClick={this.onTrickClick}
                  columns={columns}
                />
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default Tricks;
