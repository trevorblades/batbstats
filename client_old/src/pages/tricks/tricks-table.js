import PropTypes from 'prop-types';
import React, {Component} from 'react';
import SortableTable from '../../components/sortable-table';
import filter from 'lodash/filter';
import reject from 'lodash/reject';
import round from 'lodash/round';
import {withRouter} from 'react-router-dom';

function getSuccessRate(attempts) {
  const rate =
    attempts.length && filter(attempts, 'successful').length / attempts.length;
  return round(rate * 100, 2);
}

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

class TricksTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    tricks: PropTypes.array.isRequired
  };

  onTrickClick = trick => this.props.history.push(`/tricks/${trick.id}`);

  render() {
    return (
      <SortableTable
        padding="none"
        rows={this.props.tricks.map(trick => ({
          ...trick,
          osr: getSuccessRate(filter(trick.attempts, 'offense')),
          dsr: getSuccessRate(reject(trick.attempts, 'offense'))
        }))}
        onRowClick={this.onTrickClick}
        columns={columns}
      />
    );
  }
}

export default withRouter(TricksTable);
