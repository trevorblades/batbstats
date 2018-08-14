import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SortableTable from '../../components/sortable-table';
import TrickDialogContent from './trick-dialog-content';
import find from 'lodash/find';
import {connect} from 'react-redux';
import {createIsEqualWithKeys} from '../../util';
import {getTricks} from '../../selectors';

const title = 'Tricks';
const isEqualWithKeys = createIsEqualWithKeys(
  'name',
  'variation',
  'flip',
  'shuv',
  'spin'
);

class Tricks extends Component {
  static propTypes = {
    tricks: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {
    dialogOpen: false,
    trick: null
  };

  componentDidUpdate(prevProps) {
    if (this.state.trick && this.props.tricks !== prevProps.tricks) {
      const trick = find(this.props.tricks, ['id', this.state.trick.id]);
      if (trick && !isEqualWithKeys(trick, this.state.trick)) {
        this.setState({trick});
      }
    }
  }

  onTrickClick = trick =>
    this.setState({
      trick,
      dialogOpen: true
    });

  closeDialog = () => this.setState({dialogOpen: false});

  render() {
    const columns = [{key: 'name'}];
    if (this.props.user) {
      columns.push({
        key: 'complete',
        numeric: true
      });
    }

    columns.push(
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
    );

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header title={title} />
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
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  tricks: getTricks(state),
  user: state.user.data
});

export default connect(mapStateToProps)(Tricks);
