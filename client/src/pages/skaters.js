import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import sentenceCase from 'sentence-case';
import styled from 'react-emotion';
import {connect} from 'react-redux';
import {getSkaters} from '../selectors';
import {load as loadGames} from '../actions/games';

const EmptyState = styled.div({
  margin: 'auto'
});

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

class Skaters extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  state = {
    order: ORDER_DESC,
    orderBy: null
  };

  componentDidMount() {
    this.props.dispatch(loadGames());
  }

  sort = key =>
    this.setState(prevState => ({
      order:
        prevState.orderBy === key && prevState.order === ORDER_DESC
          ? ORDER_ASC
          : ORDER_DESC,
      orderBy: key
    }));

  renderEmptyState() {
    return this.props.loading ? (
      <CircularProgress />
    ) : (
      <Typography>No skaters found</Typography>
    );
  }

  render() {
    if (!this.props.skaters.length) {
      return <EmptyState>{this.renderEmptyState()}</EmptyState>;
    }

    const skaters = orderBy(
      this.props.skaters,
      this.state.orderBy,
      this.state.order
    );

    return (
      <Fragment>
        <AppBar elevation={0} position="sticky" color="inherit">
          <DialogTitle>Skaters</DialogTitle>
          <LinearProgress
            color="primary"
            variant={this.props.loading ? 'indeterminate' : 'determinate'}
            value={100}
            style={{height: 2}}
          />
        </AppBar>
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
}

const mapStateToProps = state => ({
  loading: state.games.loading,
  skaters: getSkaters(state)
});

export default connect(mapStateToProps)(Skaters);
