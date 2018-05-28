import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import {connect} from 'react-redux';
import {getFullName} from '../../util/skater';

class Games extends Component {
  static propTypes = {
    games: PropTypes.array.isRequired
  };

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Opponent</TableCell>
            <TableCell>Event</TableCell>
            <TableCell numeric>Round</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.games.map(game => {
            return (
              <TableRow key={game.id}>
                <TableCell>{getFullName(game.skaters[0])}</TableCell>
                <TableCell>{game.event.name}</TableCell>
                <TableCell numeric>{game.round}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

const mapStateToProps = state => ({
  games: state.skater.properties.games
});

export default connect(mapStateToProps)(Games);
