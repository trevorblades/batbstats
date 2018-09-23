import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';
import sentenceCase from 'sentence-case';

const ORDER_ASC = 'asc';
const ORDER_DESC = 'desc';

class SortableTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    onRowClick: PropTypes.func,
    rows: PropTypes.array.isRequired
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

  render() {
    const {columns, rows, onRowClick, ...props} = this.props;
    return (
      <Table {...props}>
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
          {orderBy(rows, this.state.orderBy, this.state.order).map(row => (
            <TableRow
              hover={Boolean(this.props.onRowClick)}
              key={row.id}
              onClick={() => onRowClick(row)}
            >
              {this.props.columns.map(column => (
                <TableCell key={column.key} numeric={column.numeric}>
                  {get(row, column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default SortableTable;
