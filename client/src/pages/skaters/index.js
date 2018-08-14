import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterDialogContent from './skater-dialog-content';
import SortableTable from '../../components/sortable-table';
import find from 'lodash/find';
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import {createIsEqualWithKeys} from '../../util';
import {getSkaters} from '../../selectors';

const createButtonSpacing = theme.spacing.unit * 3;
const CreateButton = withProps({
  variant: 'fab',
  color: 'secondary'
})(
  styled(Button)({
    position: 'absolute',
    bottom: createButtonSpacing,
    right: createButtonSpacing
  })
);

const title = 'Skaters';
const isEqualWithKeys = createIsEqualWithKeys(
  'first_name',
  'last_name',
  'stance',
  'hometown',
  'birth_date',
  'updated_at'
);

class Skaters extends Component {
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
      const skater = find(this.props.skaters, ['id', this.state.skater.id]);
      if (skater && !isEqualWithKeys(skater, this.state.skater)) {
        this.setState({skater});
      }
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
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header title={title} />
          <SortableTable
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
            <CreateButton>
              <AddIcon />
            </CreateButton>
          )}
          {this.state.skater && (
            <Dialog
              fullWidth
              open={this.state.dialogOpen}
              onClose={this.closeDialog}
            >
              <SkaterDialogContent skater={this.state.skater} />
            </Dialog>
          )}
        </GamesLoader>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  skaters: getSkaters(state),
  user: state.user.data
});

export default connect(mapStateToProps)(Skaters);
