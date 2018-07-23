import CircularProgress from '@material-ui/core/CircularProgress';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import differenceInYears from 'date-fns/differenceInYears';
import {connect} from 'react-redux';
import {getSkaters} from '../selectors';
import {load as loadGames} from '../actions/games';

const now = Date.now();
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
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
            <TableCell>Hometown</TableCell>
            <TableCell>Games played</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.skaters.map(skater => (
            <TableRow key={skater.id}>
              <TableCell>{skater.full_name}</TableCell>
              <TableCell>
                {skater.birth_date && differenceInYears(now, skater.birth_date)}
              </TableCell>
              <TableCell>{skater.hometown}</TableCell>
              <TableCell>{skater.games.length}</TableCell>
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
