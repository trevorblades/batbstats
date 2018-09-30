import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterDialogContent from './skater-dialog-content';
import SortableTable from '../../../components/sortable-table';
import find from 'lodash/find';
import styled, {css} from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import {SIDEBAR_WIDTH} from '../../../components/sidebar';

const spacing = theme.spacing.unit * 3;
const CreateButton = styled(Button)({
  position: 'fixed',
  bottom: spacing,
  left: SIDEBAR_WIDTH + spacing
});

const overflowVisible = css({overflow: 'visible'});

class SkatersTable extends Component {
  static propTypes = {
    skaters: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {
    dialogOpen: false,
    skater: null
  };

  componentDidUpdate(prevProps) {
    if (this.state.skater && this.props.skaters !== prevProps.skaters) {
      this.setState({
        skater: find(this.props.skaters, ['id', this.state.skater.id])
      });
    }
  }

  onTableRowClick = skater =>
    this.setState({
      skater,
      dialogOpen: true
    });

  closeDialog = () => this.setState({dialogOpen: false});

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
        {this.props.user && (
          <CreateButton color="secondary" variant="fab">
            <AddIcon />
          </CreateButton>
        )}
        {this.state.skater && (
          <Dialog
            fullWidth
            classes={{paper: overflowVisible}}
            open={this.state.dialogOpen}
            onClose={this.closeDialog}
          >
            <SkaterDialogContent skater={this.state.skater} />
          </Dialog>
        )}
      </Fragment>
    );
  }
}

export default SkatersTable;
