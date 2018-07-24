import EmptyStateProvider from '../components/empty-state-provider';
import Header from '../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import sentenceCase from 'sentence-case';
import {connect} from 'react-redux';
import {getSkaters} from '../selectors';

const columns = [
  {
    key: 'full_name',
    label: 'Name'
  },
  {
    key: 'games.length',
    label: 'GP',
    numeric: true
  },
  {
    key: 'wins',
    label: 'W',
    numeric: true
  },
  {
    key: 'losses',
    label: 'L',
    numeric: true
  },
  {
    key: 'attempts.length',
    label: 'TA',
    numeric: true
  },
  {
    key: 'makes',
    label: 'MA',
    numeric: true
  },
  {
    key: 'misses',
    label: 'MI',
    numeric: true
  },
  {
    key: 'redos',
    label: 'R',
    numeric: true
  }
];

const ORDER_ASC = 'asc';
const ORDER_DESC = 'desc';
const title = 'Skaters';

class Skaters extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  state = {
    order: ORDER_DESC,
    orderBy: null
  };

  sort = key =>
    this.setState(prevState => ({
      order:
        prevState.orderBy === key && prevState.order === ORDER_DESC
          ? ORDER_ASC
          : ORDER_DESC,
      orderBy: key
    }));

  renderContent() {
    const skaters = orderBy(
      this.props.skaters,
      this.state.orderBy,
      this.state.order
    );

    return (
      <Fragment>
        <Header loading={this.props.loading}>{title}</Header>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.key} numeric={column.numeric}>
                  <TableSortLabel
                    direction={this.state.order}
                    active={column.key === this.state.orderBy}
                    onClick={() => this.sort(column.key)}
                  >
                    {column.label || sentenceCase(column.key)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {skaters.map(skater => (
              <TableRow hover key={skater.id}>
                {columns.map(column => (
                  <TableCell key={column.key} numeric={column.numeric}>
                    {get(skater, column.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <EmptyStateProvider>{this.renderContent()}</EmptyStateProvider>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.games.loading,
  skaters: getSkaters(state)
});

export default connect(mapStateToProps)(Skaters);
