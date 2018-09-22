import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SortableTable from '../../components/sortable-table';
import TrickDialogContent from './trick-dialog-content';
import Typography from '@material-ui/core/Typography';
import find from 'lodash/find';
import {connect} from 'react-redux';
import {getTricks} from '../../selectors';

const title = 'Tricks';
const columns = [
  {key: 'name'},
  {
    key: 'attempts',
    label: 'A',
    numeric: true
  },
  {
    key: 'offense_success_rate',
    label: 'OSR',
    numeric: true
  },
  {
    key: 'defense_success_rate',
    label: 'DSR',
    numeric: true
  }
];

class Tricks extends Component {
  static propTypes = {
    tricks: PropTypes.array.isRequired
  };

  state = {
    dialogOpen: false,
    trick: null
  };

  componentDidUpdate(prevProps) {
    if (this.state.trick && this.props.tricks !== prevProps.tricks) {
      this.setState({
        trick: find(this.props.tricks, ['id', this.state.trick.id])
      });
    }
  }

  onTrickClick = trick =>
    this.setState({
      trick,
      dialogOpen: true
    });

  closeDialog = () => this.setState({dialogOpen: false});

  render() {
    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Fragment>
            <Header>
              <Typography variant="display1">{title}</Typography>
            </Header>
            <SortableTable
              rows={this.props.tricks}
              onRowClick={this.onTrickClick}
              columns={columns}
            />
            {this.state.trick && (
              <Dialog
                fullWidth
                open={this.state.dialogOpen}
                onClose={this.closeDialog}
              >
                <TrickDialogContent trick={this.state.trick} />
              </Dialog>
            )}
          </Fragment>
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tricks: getTricks(state)
});

export default connect(mapStateToProps)(Tricks);
