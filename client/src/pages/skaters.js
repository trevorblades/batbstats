import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import sentenceCase from 'sentence-case';
import {connect} from 'react-redux';
import {getSkaters} from '../selectors';
import {load as loadGames} from '../actions/games';

const columns = [
  {
    key: 'full_name',
    label: 'Name'
  },
  {
    key: 'hometown'
  },
  {
    key: 'age',
    numeric: true
  },
  {
    key: 'gamesPlayed',
    numeric: true
  },
  {
    key: 'wins',
    numeric: true
  },
  {
    key: 'losses',
    numeric: true
  }
];

class Skaters extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    skaters: PropTypes.array.isRequired
  };

  componentDidMount() {
    this.props.dispatch(loadGames());
  }

  render() {
    if (!this.props.skaters.length) {
      if (this.props.loading) {
        return <CircularProgress color="primary" />;
      }
      return <Typography>No skaters found</Typography>;
    }

    return (
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.key} numeric={column.numeric}>
                <TableSortLabel active={false}>
                  {column.label || sentenceCase(column.key)}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.skaters.map(skater => (
            <TableRow hover key={skater.id}>
              {columns.map(column => (
                <TableCell key={column.key} numeric={column.numeric}>
                  {skater[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.games.loading,
  skaters: getSkaters(state)
});

export default connect(mapStateToProps)(Skaters);
