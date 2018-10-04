import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SortableTable from '../../components/sortable-table';
import {withRouter} from 'react-router-dom';

class SkatersTable extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    skaters: PropTypes.array.isRequired
  };

  onTableRowClick = skater => this.props.history.push(`/skaters/${skater.id}`);

  render() {
    return (
      <Fragment>
        <SortableTable
          padding="dense"
          rows={this.props.skaters}
          onRowClick={this.onTableRowClick}
          columns={[
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
              key: 'win_percentage',
              label: 'W%',
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
          ]}
        />
      </Fragment>
    );
  }
}

export default withRouter(SkatersTable);
