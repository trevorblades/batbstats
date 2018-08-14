import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import get from 'lodash/get';
import mapProps from 'recompose/mapProps';
import orderBy from 'lodash/orderBy';
import sentenceCase from 'sentence-case';

const DenseTableCell = mapProps(props => ({
  ...props,
  padding: props.numeric ? 'dense' : 'default'
}))(TableCell);

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
    const rows = orderBy(this.props.rows, this.state.orderBy, this.state.order);
    return (
      <Table>
        <TableHead>
          <TableRow>
            {this.props.columns.map(column => (
              <DenseTableCell key={column.key} numeric={column.numeric}>
                <TableSortLabel
                  direction={this.state.order}
                  active={column.key === this.state.orderBy}
                  onClick={() => this.sort(column.key)}
                >
                  {column.label || sentenceCase(column.key)}
                </TableSortLabel>
              </DenseTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow
              hover={Boolean(this.props.onRowClick)}
              key={row.id}
              onClick={() => this.props.onRowClick(row)}
            >
              {this.props.columns.map(column => (
                <DenseTableCell key={column.key} numeric={column.numeric}>
                  {get(row, column.key)}
                </DenseTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

export default SortableTable;
