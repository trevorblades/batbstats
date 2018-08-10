import Dialog from '@material-ui/core/Dialog';
import GamesLoader from '../../components/games-loader';
import Header from '../../components/header';
import Helmet from 'react-helmet';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import TrickDialogContent from './trick-dialog-content';
import {connect} from 'react-redux';
import {getTricks} from '../../selectors';

const title = 'Tricks';
class Tricks extends Component {
  static propTypes = {
    tricks: PropTypes.array.isRequired
  };

  state = {
    dialogOpen: false,
    trick: null
  };

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
          <Header>{title}</Header>
          <List>
            {this.props.tricks.map(trick => (
              <ListItem
                key={trick.id}
                button
                onClick={() => this.onTrickClick(trick)}
              >
                <ListItemText primary={trick.name} secondary={trick.attempts} />
              </ListItem>
            ))}
          </List>
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
  tricks: getTricks(state)
});

export default connect(mapStateToProps)(Tricks);
