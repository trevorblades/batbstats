import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import SkaterDialogContent from './skater-dialog-content';
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
import styled from 'react-emotion';
import theme from '@trevorblades/mui-theme';
import withProps from 'recompose/withProps';
import {connect} from 'react-redux';
import {getSkaters} from '../../selectors';

const DenseTableCell = mapProps(props => ({
  ...props,
  padding: props.numeric ? 'dense' : 'default'
}))(TableCell);

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

const ORDER_ASC = 'asc';
const ORDER_DESC = 'desc';

const title = 'Skaters';
const columns = [
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
];

class Skaters extends Component {
  static propTypes = {
    skater: PropTypes.object,
    skaters: PropTypes.array.isRequired,
    user: PropTypes.object
  };

  state = {
    dialogOpen: false,
    order: ORDER_DESC,
    orderBy: null,
    skater: null
  };

  componentDidUpdate(prevProps) {
    const {skater} = this.props;
    if (
      skater &&
      skater !== prevProps.skater &&
      this.state.skater &&
      this.state.skater.id === skater.id
    ) {
      this.setState(prevState => ({
        skater: {
          ...prevState.skater,
          ...skater
        }
      }));
    }
  }

  onTableRowClick = skater =>
    this.setState({
      skater,
      dialogOpen: true
    });

  closeDialog = () => this.setState({dialogOpen: false});

  sort = key =>
    this.setState(prevState => ({
      order:
        prevState.orderBy === key && prevState.order === ORDER_DESC
          ? ORDER_ASC
          : ORDER_DESC,
      orderBy: key
    }));

  render() {
    const skaters = orderBy(
      this.props.skaters,
      this.state.orderBy,
      this.state.order
    );

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <GamesLoader>
          <Header>{title}</Header>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map(column => (
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
              {skaters.map(skater => (
                <TableRow
                  hover
                  key={skater.id}
                  onClick={() => this.onTableRowClick(skater)}
                >
                  {columns.map(column => (
                    <DenseTableCell key={column.key} numeric={column.numeric}>
                      {get(skater, column.key)}
                    </DenseTableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
  skater: state.skater.data,
  skaters: getSkaters(state),
  user: state.user.data
});

export default connect(mapStateToProps)(Skaters);
